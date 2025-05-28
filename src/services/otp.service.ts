import { api } from "../http/client";

interface SendOtpDto {
  phone: string;
}

interface VerifyOtpDto {
  phone: string;
  code: string;
}

interface OtpStatus {
  phone: string;
  verified: boolean;
  resendCount: number;
  attemptCount: number;
  expiresAt: string;
  lockUntil?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class OtpService {
  private basePath = "/otp";

  async sendOtp(dto: SendOtpDto): Promise<ApiResponse<null>> {
    const { data } = await api.post<ApiResponse<null>>(`${this.basePath}/send`, dto);
    return data;
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<ApiResponse<null>> {
    const { data } = await api.post<ApiResponse<null>>(`${this.basePath}/verify`, dto);
    return data;
  }

  async getOtpStatus(phone: string): Promise<OtpStatus> {
    const { data } = await api.get<OtpStatus>(`${this.basePath}/${phone}`);
    return data;
  }
}
