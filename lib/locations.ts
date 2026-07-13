export type CountryCode = "VN" | "US";

export const VN_CITIES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export const US_CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
  "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington, D.C.",
  "Boston", "Nashville", "Detroit", "Portland", "Las Vegas",
  "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque",
  "Tucson", "Fresno", "Sacramento", "Kansas City", "Atlanta",
  "Miami", "Oakland", "Minneapolis", "New Orleans", "Cleveland",
  "Tampa", "Orlando", "Pittsburgh", "Cincinnati", "St. Louis",
  "Salt Lake City", "Raleigh", "Honolulu", "Anchorage", "San Bernardino"
];

export const CITIES: Record<CountryCode, string[]> = { VN: VN_CITIES, US: US_CITIES };

export function findCountryOf(city: string | null | undefined): CountryCode | null {
  if (!city) return null;
  if (VN_CITIES.includes(city)) return "VN";
  if (US_CITIES.includes(city)) return "US";
  return null;
}

/** So khop khong dau: "ha noi" -> "Hà Nội" */
export function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
