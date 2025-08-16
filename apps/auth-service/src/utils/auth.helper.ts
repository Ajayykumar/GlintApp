import crypto from 'crypto';
import { ValidationError } from '@packages/error-handler';
import redis from '@packages/libs/redis';
import { sendEmail } from './sendMail';
import { NextFunction } from 'express';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data;

    if (!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
        throw new ValidationError('Invalid request data');
    }
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid request data');
    }

}

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`$opt_lock:$${email}`)) {
        return next(new ValidationError('Account locked due to too many failed attempts. Please try again after 30 minute.'));
    }
    if (await redis.get(`$otp_spam_lock: ${email}`)) {
        return next(new ValidationError('Too many requests! Please wait for 1 hour before requesting again.'));
    }
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError('Please wait for 1 minutes before requesting new OTP.'));
    }
}

export const trackOtpRequests = async (email: string, next: NextFunction) => {
    const otpRequestKey = `$otp_request_count:${email}`;
    let otpRequests = parseInt(await redis.get(otpRequestKey) || '0');

    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);//Lock for 1 hour
        return next(new ValidationError('Too many OTP requests! Please wait for 1 hour before requesting again.'));
    }
    await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600);
}

export const sendOtp = async (
    name: string,
    email: string,
    template: string
) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, 'Verify Your Email', template, { name, otp });
    await redis.set(`$otp:${email}`, otp, 'EX', 300);
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);
}


