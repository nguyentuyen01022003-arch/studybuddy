export interface UsState {
  code: string;
  name: string;
  cities: string[];
}

export interface Country {
  code: string;
  flag: string;
  nameVi: string;
  nameEn: string;
  /** Danh sach thanh pho (voi US thi dung states thay the) */
  cities?: string[];
  states?: UsState[];
}

export const US_STATES: UsState[] = [
  { code: "AL", name: "Alabama", cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"] },
  { code: "AK", name: "Alaska", cities: ["Anchorage", "Fairbanks", "Juneau"] },
  { code: "AZ", name: "Arizona", cities: ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Tempe"] },
  { code: "AR", name: "Arkansas", cities: ["Little Rock", "Fayetteville", "Fort Smith"] },
  { code: "CA", name: "California", cities: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Sacramento", "Fresno", "Oakland", "Irvine", "Berkeley", "Long Beach", "Anaheim", "Santa Ana", "Riverside", "Stockton"] },
  { code: "CO", name: "Colorado", cities: ["Denver", "Colorado Springs", "Aurora", "Boulder", "Fort Collins"] },
  { code: "CT", name: "Connecticut", cities: ["Hartford", "New Haven", "Stamford", "Bridgeport"] },
  { code: "DE", name: "Delaware", cities: ["Wilmington", "Dover", "Newark"] },
  { code: "DC", name: "Washington, D.C.", cities: ["Washington"] },
  { code: "FL", name: "Florida", cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Fort Lauderdale", "Tallahassee", "Gainesville"] },
  { code: "GA", name: "Georgia", cities: ["Atlanta", "Savannah", "Athens", "Augusta", "Columbus"] },
  { code: "HI", name: "Hawaii", cities: ["Honolulu", "Hilo", "Kailua"] },
  { code: "ID", name: "Idaho", cities: ["Boise", "Meridian", "Idaho Falls"] },
  { code: "IL", name: "Illinois", cities: ["Chicago", "Aurora", "Naperville", "Springfield", "Peoria", "Champaign"] },
  { code: "IN", name: "Indiana", cities: ["Indianapolis", "Fort Wayne", "Bloomington", "South Bend"] },
  { code: "IA", name: "Iowa", cities: ["Des Moines", "Cedar Rapids", "Iowa City", "Ames"] },
  { code: "KS", name: "Kansas", cities: ["Wichita", "Overland Park", "Kansas City", "Topeka", "Lawrence"] },
  { code: "KY", name: "Kentucky", cities: ["Louisville", "Lexington", "Bowling Green"] },
  { code: "LA", name: "Louisiana", cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"] },
  { code: "ME", name: "Maine", cities: ["Portland", "Bangor", "Augusta"] },
  { code: "MD", name: "Maryland", cities: ["Baltimore", "Columbia", "Silver Spring", "Rockville", "College Park"] },
  { code: "MA", name: "Massachusetts", cities: ["Boston", "Cambridge", "Worcester", "Springfield", "Somerville", "Amherst"] },
  { code: "MI", name: "Michigan", cities: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "East Lansing"] },
  { code: "MN", name: "Minnesota", cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth"] },
  { code: "MS", name: "Mississippi", cities: ["Jackson", "Gulfport", "Oxford", "Hattiesburg"] },
  { code: "MO", name: "Missouri", cities: ["Kansas City", "St. Louis", "Springfield", "Columbia"] },
  { code: "MT", name: "Montana", cities: ["Billings", "Missoula", "Bozeman"] },
  { code: "NE", name: "Nebraska", cities: ["Omaha", "Lincoln", "Bellevue"] },
  { code: "NV", name: "Nevada", cities: ["Las Vegas", "Reno", "Henderson"] },
  { code: "NH", name: "New Hampshire", cities: ["Manchester", "Nashua", "Concord", "Hanover"] },
  { code: "NJ", name: "New Jersey", cities: ["Newark", "Jersey City", "Princeton", "New Brunswick", "Hoboken"] },
  { code: "NM", name: "New Mexico", cities: ["Albuquerque", "Santa Fe", "Las Cruces"] },
  { code: "NY", name: "New York", cities: ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse", "Ithaca"] },
  { code: "NC", name: "North Carolina", cities: ["Charlotte", "Raleigh", "Durham", "Greensboro", "Chapel Hill", "Winston-Salem"] },
  { code: "ND", name: "North Dakota", cities: ["Fargo", "Bismarck", "Grand Forks"] },
  { code: "OH", name: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati", "Dayton", "Toledo", "Akron"] },
  { code: "OK", name: "Oklahoma", cities: ["Oklahoma City", "Tulsa", "Norman", "Stillwater"] },
  { code: "OR", name: "Oregon", cities: ["Portland", "Eugene", "Salem", "Corvallis", "Bend"] },
  { code: "PA", name: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Allentown", "State College", "Harrisburg"] },
  { code: "RI", name: "Rhode Island", cities: ["Providence", "Warwick", "Newport"] },
  { code: "SC", name: "South Carolina", cities: ["Charleston", "Columbia", "Greenville", "Clemson"] },
  { code: "SD", name: "South Dakota", cities: ["Sioux Falls", "Rapid City", "Brookings"] },
  { code: "TN", name: "Tennessee", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"] },
  { code: "TX", name: "Texas", cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Plano", "Lubbock", "College Station"] },
  { code: "UT", name: "Utah", cities: ["Salt Lake City", "Provo", "West Valley City", "Ogden"] },
  { code: "VT", name: "Vermont", cities: ["Burlington", "Montpelier"] },
  { code: "VA", name: "Virginia", cities: ["Virginia Beach", "Richmond", "Norfolk", "Arlington", "Charlottesville", "Blacksburg"] },
  { code: "WA", name: "Washington", cities: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Redmond", "Pullman"] },
  { code: "WV", name: "West Virginia", cities: ["Charleston", "Morgantown", "Huntington"] },
  { code: "WI", name: "Wisconsin", cities: ["Milwaukee", "Madison", "Green Bay"] },
  { code: "WY", name: "Wyoming", cities: ["Cheyenne", "Casper", "Laramie"] }
];

export const COUNTRIES: Country[] = [
  {
    code: "VN", flag: "🇻🇳", nameVi: "Việt Nam", nameEn: "Vietnam",
    cities: [
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
    ]
  },
  { code: "US", flag: "🇺🇸", nameVi: "Hoa Kỳ", nameEn: "United States", states: US_STATES },
  {
    code: "GB", flag: "🇬🇧", nameVi: "Anh", nameEn: "United Kingdom",
    cities: ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Sheffield", "Bristol", "Newcastle", "Nottingham", "Leicester", "Oxford", "Cambridge", "Edinburgh", "Glasgow", "Cardiff", "Belfast"]
  },
  {
    code: "CA", flag: "🇨🇦", nameVi: "Canada", nameEn: "Canada",
    cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "Halifax", "Victoria", "Waterloo"]
  },
  {
    code: "AU", flag: "🇦🇺", nameVi: "Úc", nameEn: "Australia",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart", "Darwin"]
  },
  {
    code: "JP", flag: "🇯🇵", nameVi: "Nhật Bản", nameEn: "Japan",
    cities: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Saitama", "Hiroshima", "Sendai"]
  },
  {
    code: "KR", flag: "🇰🇷", nameVi: "Hàn Quốc", nameEn: "South Korea",
    cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan"]
  },
  {
    code: "CN", flag: "🇨🇳", nameVi: "Trung Quốc", nameEn: "China",
    cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou", "Wuhan", "Xi'an", "Nanjing", "Tianjin", "Chongqing", "Suzhou"]
  },
  { code: "SG", flag: "🇸🇬", nameVi: "Singapore", nameEn: "Singapore", cities: ["Singapore"] },
  {
    code: "TH", flag: "🇹🇭", nameVi: "Thái Lan", nameEn: "Thailand",
    cities: ["Bangkok", "Chiang Mai", "Nonthaburi", "Pattaya", "Phuket", "Khon Kaen", "Hat Yai"]
  },
  {
    code: "MY", flag: "🇲🇾", nameVi: "Malaysia", nameEn: "Malaysia",
    cities: ["Kuala Lumpur", "George Town", "Johor Bahru", "Ipoh", "Shah Alam", "Malacca"]
  },
  {
    code: "ID", flag: "🇮🇩", nameVi: "Indonesia", nameEn: "Indonesia",
    cities: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Yogyakarta"]
  },
  {
    code: "PH", flag: "🇵🇭", nameVi: "Philippines", nameEn: "Philippines",
    cities: ["Manila", "Quezon City", "Davao", "Cebu", "Makati", "Baguio"]
  },
  {
    code: "IN", flag: "🇮🇳", nameVi: "Ấn Độ", nameEn: "India",
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur"]
  },
  {
    code: "FR", flag: "🇫🇷", nameVi: "Pháp", nameEn: "France",
    cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"]
  },
  {
    code: "DE", flag: "🇩🇪", nameVi: "Đức", nameEn: "Germany",
    cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Dresden"]
  }
];

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/** Voi US, city duoc luu dang "City, ST" (vi du "Austin, TX") */
export function cityValueForUs(city: string, stateCode: string): string {
  return `${city}, ${stateCode}`;
}

export interface CityLocation {
  country: string;
  stateCode?: string;
}

/** Tim quoc gia (va bang neu la US) cua mot thanh pho da luu */
export function findLocationOf(city: string | null | undefined): CityLocation | null {
  if (!city) return null;
  const m = city.match(/^(.+), ([A-Z]{2})$/);
  if (m) {
    const st = US_STATES.find((s) => s.code === m[2] && s.cities.includes(m[1]));
    if (st) return { country: "US", stateCode: st.code };
  }
  for (const c of COUNTRIES) {
    if (c.cities?.includes(city)) return { country: c.code };
  }
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
