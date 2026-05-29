const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const LOGIN_ATTEMPTS_KEY = "linh-nam-login-attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return "Vui lòng nhập email.";
  if (trimmed.length > 254) return "Email quá dài.";
  if (!EMAIL_RE.test(trimmed)) return "Email không đúng định dạng.";
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Họ tên cần ít nhất 2 ký tự.";
  if (trimmed.length > 60) return "Họ tên tối đa 60 ký tự.";
  if (!/^[\p{L}\s'.-]+$/u.test(trimmed)) {
    return "Họ tên chỉ gồm chữ cái và khoảng trắng.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Mật khẩu tối thiểu 8 ký tự.";
  if (password.length > 72) return "Mật khẩu tối đa 72 ký tự.";
  if (!/[a-z]/.test(password)) return "Cần ít nhất một chữ thường.";
  if (!/[A-Z]/.test(password)) return "Cần ít nhất một chữ hoa.";
  if (!/[0-9]/.test(password)) return "Cần ít nhất một chữ số.";
  return null;
}

export function validatePasswordMatch(password: string, confirm: string): string | null {
  if (password !== confirm) return "Mật khẩu xác nhận không khớp.";
  return null;
}

export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

interface LoginAttempts {
  count: number;
  lockedUntil: number | null;
}

function readAttempts(): LoginAttempts {
  if (typeof window === "undefined") return { count: 0, lockedUntil: null };
  try {
    return JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) ?? '{"count":0,"lockedUntil":null}');
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function writeAttempts(data: LoginAttempts) {
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(data));
}

export function getLoginLockoutMessage(): string | null {
  const { lockedUntil } = readAttempts();
  if (!lockedUntil) return null;
  if (Date.now() < lockedUntil) {
    const mins = Math.ceil((lockedUntil - Date.now()) / 60000);
    return `Đăng nhập tạm khóa sau ${MAX_ATTEMPTS} lần sai. Thử lại sau ${mins} phút.`;
  }
  writeAttempts({ count: 0, lockedUntil: null });
  return null;
}

export function recordFailedLogin(): void {
  const data = readAttempts();
  const count = data.count + 1;
  if (count >= MAX_ATTEMPTS) {
    writeAttempts({ count, lockedUntil: Date.now() + LOCKOUT_MS });
  } else {
    writeAttempts({ count, lockedUntil: null });
  }
}

export function clearLoginAttempts(): void {
  writeAttempts({ count: 0, lockedUntil: null });
}
