import { api } from "../http/client";

export interface SendOtpDto {
  phone: string;
  channel: "sms" | "whatsapp";
  storeId?: string;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
}

export interface OtpStatus {
  phone: string;
  verified: boolean;
  resendCount: number;
  attemptCount: number;
  expiresAt: string;
  lockUntil?: string;
}

export interface SendOtpResponseData {
  channel: "sms";
  secondsLeft: number;
  attemptsLeft: number;
  resendLeft: number;
  locked: boolean;
  // Otros campos del backend si hay...
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class OtpService {
  private basePath = "/otp";

  async sendOtp(dto: SendOtpDto): Promise<ApiResponse<SendOtpResponseData>> {
    // The OTP service returns counters at the top level; older deployments
    // wrap them in data. Expose the same shape to all forms.
    const { data } = await api.post<ApiResponse<SendOtpResponseData> & Partial<SendOtpResponseData>>(
      `${this.basePath}/send`,
      dto
    );
    return {
      ...data,
      data: data.data ?? (typeof data.secondsLeft === "number" ? {
        channel: "sms",
        secondsLeft: data.secondsLeft,
        attemptsLeft: data.attemptsLeft!,
        resendLeft: data.resendLeft!,
        locked: data.locked!,
      } : undefined),
    };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<ApiResponse<null>> {
    const { data } = await api.post<ApiResponse<null>>(
      `${this.basePath}/verify`,
      dto
    );
    return data;
  }

  async getOtpStatus(phone: string): Promise<OtpStatus> {
    const { data } = await api.get<OtpStatus>(`${this.basePath}/${phone}`);
    return data;
  }
}
