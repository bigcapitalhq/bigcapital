/**
 * References
 * 1. https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes
 * 2. https://github.com/davidkalosi/js-money/blob/master/lib/currency.js
 */

const currencies = {
  "USD": {
      "symbol": "$",
      "name": "US Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "USD",
      "name_plural": "US dollars",
      "numericCode": "840"
  },
  "CAD": {
      "symbol": "CA$",
      "name": "Canadian Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CAD",
      "name_plural": "Canadian dollars",
      "numericCode": "124"
  },
  "EUR": {
      "symbol": "€",
      "name": "Euro",
      "symbol_native": "€",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "EUR",
      "name_plural": "euros",
      "numericCode": "978"
  },
  "BTC": {
      "symbol": "BTC",
      "name": "Bitcoin",
      "symbol_native": "฿",
      "decimal_digits": 8,
      "rounding": 0,
      "code": "BTC",
      "name_plural": "Bitcoins"
  },
  "AED": {
      "symbol": "AED",
      "name": "United Arab Emirates Dirham",
      "symbol_native": "د.إ.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AED",
      "name_plural": "UAE dirhams",
      "numericCode": "784"
  },
  "AFN": {
      "symbol": "Af",
      "name": "Afghan Afghani",
      "symbol_native": "؋",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AFN",
      "name_plural": "Afghan Afghanis",
      "numericCode": "971"
  },
  "ALL": {
      "symbol": "ALL",
      "name": "Albanian Lek",
      "symbol_native": "Lek",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ALL",
      "name_plural": "Albanian lekë",
      "numericCode": "008"
  },
  "AMD": {
      "symbol": "AMD",
      "name": "Armenian Dram",
      "symbol_native": "դր.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AMD",
      "name_plural": "Armenian drams",
      "numericCode": "051"
  },
  "ARS": {
      "symbol": "AR$",
      "name": "Argentine Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ARS",
      "name_plural": "Argentine pesos",
      "numericCode": "032"
  },
  "AUD": {
      "symbol": "AU$",
      "name": "Australian Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AUD",
      "name_plural": "Australian dollars",
      "numericCode": "036"
  },
  "AZN": {
      "symbol": "man.",
      "name": "Azerbaijani Manat",
      "symbol_native": "ман.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "AZN",
      "name_plural": "Azerbaijani manats",
      "numericCode": "944"
  },
  "BAM": {
      "symbol": "KM",
      "name": "Bosnia-Herzegovina Convertible Mark",
      "symbol_native": "KM",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BAM",
      "name_plural": "Bosnia-Herzegovina convertible marks",
      "numericCode": "977"
  },
  "BDT": {
      "symbol": "Tk",
      "name": "Bangladeshi Taka",
      "symbol_native": "৳",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BDT",
      "name_plural": "Bangladeshi takas",
      "numericCode": "050"
  },
  "BGN": {
      "symbol": "BGN",
      "name": "Bulgarian Lev",
      "symbol_native": "лв.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BGN",
      "name_plural": "Bulgarian leva",
      "numericCode": "975"
  },
  "BHD": {
      "symbol": "BD",
      "name": "Bahraini Dinar",
      "symbol_native": "د.ب.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "BHD",
      "name_plural": "Bahraini dinars",
      "numericCode": "048"
  },
  "BIF": {
      "symbol": "FBu",
      "name": "Burundian Franc",
      "symbol_native": "FBu",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "BIF",
      "name_plural": "Burundian francs",
      "numericCode": "108"
  },
  "BND": {
      "symbol": "BN$",
      "name": "Brunei Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BND",
      "name_plural": "Brunei dollars",
      "numericCode": "096"
  },
  "BOB": {
      "symbol": "Bs",
      "name": "Bolivian Boliviano",
      "symbol_native": "Bs",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BOB",
      "name_plural": "Bolivian bolivianos",
      "numericCode": "068"
  },
  "BRL": {
      "symbol": "R$",
      "name": "Brazilian Real",
      "symbol_native": "R$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BRL",
      "name_plural": "Brazilian reals",
      "numericCode": "986"
  },
  "BWP": {
      "symbol": "BWP",
      "name": "Botswanan Pula",
      "symbol_native": "P",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BWP",
      "name_plural": "Botswanan pulas",
      "numericCode": "072"
  },
  "BYN": {
      "symbol": "BR",
      "name": "Belarusian Ruble",
      "symbol_native": "BR",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BYN",
      "name_plural": "Belarusian rubles",
      "numericCode": "933"
  },
  "BZD": {
      "symbol": "BZ$",
      "name": "Belize Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "BZD",
      "name_plural": "Belize dollars",
      "numericCode": "084"
  },
  "CDF": {
      "symbol": "CDF",
      "name": "Congolese Franc",
      "symbol_native": "FrCD",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CDF",
      "name_plural": "Congolese francs",
      "numericCode": "976"
  },
  "CHF": {
      "symbol": "CHF",
      "name": "Swiss Franc",
      "symbol_native": "CHF",
      "decimal_digits": 2,
      "rounding": 0.05,
      "code": "CHF",
      "name_plural": "Swiss francs",
      "numericCode": "756"
  },
  "CLP": {
      "symbol": "CL$",
      "name": "Chilean Peso",
      "symbol_native": "$",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "CLP",
      "name_plural": "Chilean pesos",
      "numericCode": "152"
  },
  "CNY": {
      "symbol": "CN¥",
      "name": "Chinese Yuan",
      "symbol_native": "CN¥",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CNY",
      "name_plural": "Chinese yuan",
      "numericCode": "156"
  },
  "COP": {
      "symbol": "CO$",
      "name": "Colombian Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "COP",
      "name_plural": "Colombian pesos",
      "numericCode": "170"
  },
  "CRC": {
      "symbol": "₡",
      "name": "Costa Rican Colón",
      "symbol_native": "₡",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CRC",
      "name_plural": "Costa Rican colóns",
      "numericCode": "188"
  },
  "CVE": {
      "symbol": "CV$",
      "name": "Cape Verdean Escudo",
      "symbol_native": "CV$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CVE",
      "name_plural": "Cape Verdean escudos",
      "numericCode": "132"
  },
  "CZK": {
      "symbol": "Kč",
      "name": "Czech Republic Koruna",
      "symbol_native": "Kč",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "CZK",
      "name_plural": "Czech Republic korunas",
      "numericCode": "203"
  },
  "DJF": {
      "symbol": "Fdj",
      "name": "Djiboutian Franc",
      "symbol_native": "Fdj",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "DJF",
      "name_plural": "Djiboutian francs",
      "numericCode": "262"
  },
  "DKK": {
      "symbol": "Dkr",
      "name": "Danish Krone",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DKK",
      "name_plural": "Danish kroner",
      "numericCode": "208"
  },
  "DOP": {
      "symbol": "RD$",
      "name": "Dominican Peso",
      "symbol_native": "RD$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DOP",
      "name_plural": "Dominican pesos",
      "numericCode": "214"
  },
  "DZD": {
      "symbol": "DA",
      "name": "Algerian Dinar",
      "symbol_native": "د.ج.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "DZD",
      "name_plural": "Algerian dinars",
      "numericCode": "012"
  },
  "EGP": {
      "symbol": "EGP",
      "name": "Egyptian Pound",
      "symbol_native": "ج.م.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "EGP",
      "name_plural": "Egyptian pounds",
      "numericCode": "818"
  },
  "ERN": {
      "symbol": "Nfk",
      "name": "Eritrean Nakfa",
      "symbol_native": "Nfk",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ERN",
      "name_plural": "Eritrean nakfas",
      "numericCode": "232"
  },
  "ETB": {
      "symbol": "Br",
      "name": "Ethiopian Birr",
      "symbol_native": "Br",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ETB",
      "name_plural": "Ethiopian birrs",
      "numericCode": "230"
  },
  "GBP": {
      "symbol": "£",
      "name": "British Pound Sterling",
      "symbol_native": "£",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GBP",
      "name_plural": "British pounds sterling",
      "numericCode": "826"
  },
  "GEL": {
      "symbol": "GEL",
      "name": "Georgian Lari",
      "symbol_native": "GEL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GEL",
      "name_plural": "Georgian laris",
      "numericCode": "981"
  },
  "GHS": {
      "symbol": "GH₵",
      "name": "Ghanaian Cedi",
      "symbol_native": "GH₵",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GHS",
      "name_plural": "Ghanaian cedis",
      "numericCode": "936"
  },
  "GNF": {
      "symbol": "FG",
      "name": "Guinean Franc",
      "symbol_native": "FG",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "GNF",
      "name_plural": "Guinean francs",
      "numericCode": "324"
  },
  "GTQ": {
      "symbol": "GTQ",
      "name": "Guatemalan Quetzal",
      "symbol_native": "Q",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "GTQ",
      "name_plural": "Guatemalan quetzals",
      "numericCode": "320"
  },
  "HKD": {
      "symbol": "HK$",
      "name": "Hong Kong Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HKD",
      "name_plural": "Hong Kong dollars",
      "numericCode": "344"
  },
  "HNL": {
      "symbol": "HNL",
      "name": "Honduran Lempira",
      "symbol_native": "L",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HNL",
      "name_plural": "Honduran lempiras",
      "numericCode": "340"
  },
  "HRK": {
      "symbol": "kn",
      "name": "Croatian Kuna",
      "symbol_native": "kn",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HRK",
      "name_plural": "Croatian kunas",
      "numericCode": "191"
  },
  "HUF": {
      "symbol": "Ft",
      "name": "Hungarian Forint",
      "symbol_native": "Ft",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "HUF",
      "name_plural": "Hungarian forints",
      "numericCode": "348"
  },
  "IDR": {
      "symbol": "Rp",
      "name": "Indonesian Rupiah",
      "symbol_native": "Rp",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "IDR",
      "name_plural": "Indonesian rupiahs",
      "numericCode": "360"
  },
  "ILS": {
      "symbol": "₪",
      "name": "Israeli New Sheqel",
      "symbol_native": "₪",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ILS",
      "name_plural": "Israeli new sheqels",
      "numericCode": "376"
  },
  "INR": {
      "symbol": "Rs",
      "name": "Indian Rupee",
      "symbol_native": "টকা",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "INR",
      "name_plural": "Indian rupees",
      "numericCode": "356"
  },
  "IQD": {
      "symbol": "IQD",
      "name": "Iraqi Dinar",
      "symbol_native": "د.ع.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "IQD",
      "name_plural": "Iraqi dinars",
      "numericCode": "368"
  },
  "IRR": {
      "symbol": "IRR",
      "name": "Iranian Rial",
      "symbol_native": "﷼",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "IRR",
      "name_plural": "Iranian rials",
      "numericCode": "364"
  },
  "ISK": {
      "symbol": "Ikr",
      "name": "Icelandic Króna",
      "symbol_native": "kr",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "ISK",
      "name_plural": "Icelandic krónur",
      "numericCode": "352"
  },
  "JMD": {
      "symbol": "J$",
      "name": "Jamaican Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "JMD",
      "name_plural": "Jamaican dollars",
      "numericCode": "388"
  },
  "JOD": {
      "symbol": "JD",
      "name": "Jordanian Dinar",
      "symbol_native": "د.أ.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "JOD",
      "name_plural": "Jordanian dinars",
      "numericCode": "400"
  },
  "JPY": {
      "symbol": "¥",
      "name": "Japanese Yen",
      "symbol_native": "￥",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "JPY",
      "name_plural": "Japanese yen",
      "numericCode": "392"
  },
  "KES": {
      "symbol": "Ksh",
      "name": "Kenyan Shilling",
      "symbol_native": "Ksh",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KES",
      "name_plural": "Kenyan shillings",
      "numericCode": "404"
  },
  "KHR": {
      "symbol": "KHR",
      "name": "Cambodian Riel",
      "symbol_native": "៛",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KHR",
      "name_plural": "Cambodian riels",
      "numericCode": "116"
  },
  "KMF": {
      "symbol": "CF",
      "name": "Comorian Franc",
      "symbol_native": "FC",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "KMF",
      "name_plural": "Comorian francs",
      "numericCode": "174"
  },
  "KRW": {
      "symbol": "₩",
      "name": "South Korean Won",
      "symbol_native": "₩",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "KRW",
      "name_plural": "South Korean won",
      "numericCode": "410"
  },
  "KWD": {
      "symbol": "KD",
      "name": "Kuwaiti Dinar",
      "symbol_native": "د.ك.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "KWD",
      "name_plural": "Kuwaiti dinars",
      "numericCode": "414"
  },
  "KZT": {
      "symbol": "₸",
      "name": "Kazakhstani Tenge",
      "symbol_native": "₸",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "KZT",
      "name_plural": "Kazakhstani tenges",
      "numericCode": "398"
  },
  "LAK": {
      "symbol": "₭",
      "name": "Lao kip",
      "symbol_native": "ກີບ",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LAK",
      "name_plural": "Lao kips",
      "numericCode": "418"
  },
  "LBP": {
      "symbol": "LB£",
      "name": "Lebanese Pound",
      "symbol_native": "ل.ل.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LBP",
      "name_plural": "Lebanese pounds",
      "numericCode": "422"
  },
  "LKR": {
      "symbol": "SLRs",
      "name": "Sri Lankan Rupee",
      "symbol_native": "SL Re",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "LKR",
      "name_plural": "Sri Lankan rupees",
      "numericCode": "144"
  },
  "LYD": {
      "symbol": "LD",
      "name": "Libyan Dinar",
      "symbol_native": "د.ل.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "LYD",
      "name_plural": "Libyan dinars",
      "numericCode": "434"
  },
  "MAD": {
      "symbol": "MAD",
      "name": "Moroccan Dirham",
      "symbol_native": "د.م.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MAD",
      "name_plural": "Moroccan dirhams",
      "numericCode": "504"
  },
  "MDL": {
      "symbol": "MDL",
      "name": "Moldovan Leu",
      "symbol_native": "MDL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MDL",
      "name_plural": "Moldovan lei",
      "numericCode": "498"
  },
  "MGA": {
      "symbol": "MGA",
      "name": "Malagasy Ariary",
      "symbol_native": "MGA",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MGA",
      "name_plural": "Malagasy Ariaries",
      "numericCode": "969"
  },
  "MKD": {
      "symbol": "MKD",
      "name": "Macedonian Denar",
      "symbol_native": "MKD",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MKD",
      "name_plural": "Macedonian denari",
      "numericCode": "807"
  },
  "MMK": {
      "symbol": "MMK",
      "name": "Myanma Kyat",
      "symbol_native": "K",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MMK",
      "name_plural": "Myanma kyats",
      "numericCode": "104"
  },
  "MOP": {
      "symbol": "MOP$",
      "name": "Macanese Pataca",
      "symbol_native": "MOP$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MOP",
      "name_plural": "Macanese patacas",
      "numericCode": "446"
  },
  "MUR": {
      "symbol": "MURs",
      "name": "Mauritian Rupee",
      "symbol_native": "MURs",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MUR",
      "name_plural": "Mauritian rupees",
      "numericCode": "480"
  },
  "MXN": {
      "symbol": "MX$",
      "name": "Mexican Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MXN",
      "name_plural": "Mexican pesos",
      "numericCode": "484"
  },
  "MYR": {
      "symbol": "RM",
      "name": "Malaysian Ringgit",
      "symbol_native": "RM",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MYR",
      "name_plural": "Malaysian ringgits",
      "numericCode": "458"
  },
  "MZN": {
      "symbol": "MTn",
      "name": "Mozambican Metical",
      "symbol_native": "MTn",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "MZN",
      "name_plural": "Mozambican meticals",
      "numericCode": "943"
  },
  "NAD": {
      "symbol": "N$",
      "name": "Namibian Dollar",
      "symbol_native": "N$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NAD",
      "name_plural": "Namibian dollars",
      "numericCode": "516"
  },
  "NGN": {
      "symbol": "₦",
      "name": "Nigerian Naira",
      "symbol_native": "₦",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NGN",
      "name_plural": "Nigerian nairas",
      "numericCode": "566"
  },
  "NIO": {
      "symbol": "C$",
      "name": "Nicaraguan Córdoba",
      "symbol_native": "C$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NIO",
      "name_plural": "Nicaraguan córdobas",
      "numericCode": "558"
  },
  "NOK": {
      "symbol": "Nkr",
      "name": "Norwegian Krone",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NOK",
      "name_plural": "Norwegian kroner",
      "numericCode": "578"
  },
  "NPR": {
      "symbol": "NPRs",
      "name": "Nepalese Rupee",
      "symbol_native": "नेरू",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NPR",
      "name_plural": "Nepalese rupees",
      "numericCode": "524"
  },
  "NZD": {
      "symbol": "NZ$",
      "name": "New Zealand Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "NZD",
      "name_plural": "New Zealand dollars",
      "numericCode": "554"
  },
  "OMR": {
      "symbol": "OMR",
      "name": "Omani Rial",
      "symbol_native": "ر.ع.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "OMR",
      "name_plural": "Omani rials",
      "numericCode": "512"
  },
  "PAB": {
      "symbol": "B/.",
      "name": "Panamanian Balboa",
      "symbol_native": "B/.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PAB",
      "name_plural": "Panamanian balboas",
      "numericCode": "590"
  },
  "PEN": {
      "symbol": "S/.",
      "name": "Peruvian Nuevo Sol",
      "symbol_native": "S/.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PEN",
      "name_plural": "Peruvian nuevos soles",
      "numericCode": "604"
  },
  "PHP": {
      "symbol": "₱",
      "name": "Philippine Peso",
      "symbol_native": "₱",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PHP",
      "name_plural": "Philippine pesos",
      "numericCode": "608"
  },
  "PKR": {
      "symbol": "PKRs",
      "name": "Pakistani Rupee",
      "symbol_native": "₨",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PKR",
      "name_plural": "Pakistani rupees",
      "numericCode": "586"
  },
  "PLN": {
      "symbol": "zł",
      "name": "Polish Zloty",
      "symbol_native": "zł",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "PLN",
      "name_plural": "Polish zlotys",
      "numericCode": "985"
  },
  "PYG": {
      "symbol": "₲",
      "name": "Paraguayan Guarani",
      "symbol_native": "₲",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "PYG",
      "name_plural": "Paraguayan guaranis",
      "numericCode": "600"
  },
  "QAR": {
      "symbol": "QR",
      "name": "Qatari Rial",
      "symbol_native": "ر.ق.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "QAR",
      "name_plural": "Qatari rials",
      "numericCode": "634"
  },
  "RON": {
      "symbol": "RON",
      "name": "Romanian Leu",
      "symbol_native": "RON",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "RON",
      "name_plural": "Romanian lei",
      "numericCode": "946"
  },
  "RSD": {
      "symbol": "din.",
      "name": "Serbian Dinar",
      "symbol_native": "дин.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "RSD",
      "name_plural": "Serbian dinars",
      "numericCode": "941"
  },
  "RUB": {
      "symbol": "RUB",
      "name": "Russian Ruble",
      "symbol_native": "₽",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "RUB",
      "name_plural": "Russian rubles",
      "numericCode": "643"
  },
  "RWF": {
      "symbol": "RWF",
      "name": "Rwandan Franc",
      "symbol_native": "FR",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "RWF",
      "name_plural": "Rwandan francs",
      "numericCode": "646"
  },
  "SAR": {
      "symbol": "SR",
      "name": "Saudi Riyal",
      "symbol_native": "ر.س.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SAR",
      "name_plural": "Saudi riyals",
      "numericCode": "682"
  },
  "SDG": {
      "symbol": "SDG",
      "name": "Sudanese Pound",
      "symbol_native": "SDG",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SDG",
      "name_plural": "Sudanese pounds",
      "numericCode": "938"
  },
  "SEK": {
      "symbol": "Skr",
      "name": "Swedish Krona",
      "symbol_native": "kr",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SEK",
      "name_plural": "Swedish kronor",
      "numericCode": "752"
  },
  "SGD": {
      "symbol": "S$",
      "name": "Singapore Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SGD",
      "name_plural": "Singapore dollars",
      "numericCode": "702"
  },
  "SOS": {
      "symbol": "Ssh",
      "name": "Somali Shilling",
      "symbol_native": "Ssh",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SOS",
      "name_plural": "Somali shillings",
      "numericCode": "706"
  },
  "SYP": {
      "symbol": "SY£",
      "name": "Syrian Pound",
      "symbol_native": "ل.س.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "SYP",
      "name_plural": "Syrian pounds",
      "numericCode": "760"
  },
  "THB": {
      "symbol": "฿",
      "name": "Thai Baht",
      "symbol_native": "฿",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "THB",
      "name_plural": "Thai baht",
      "numericCode": "764"
  },
  "TND": {
      "symbol": "DT",
      "name": "Tunisian Dinar",
      "symbol_native": "د.ت.‏",
      "decimal_digits": 3,
      "rounding": 0,
      "code": "TND",
      "name_plural": "Tunisian dinars",
      "numericCode": "788"
  },
  "TOP": {
      "symbol": "T$",
      "name": "Tongan Paʻanga",
      "symbol_native": "T$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TOP",
      "name_plural": "Tongan paʻanga",
      "numericCode": "776"
  },
  "TRY": {
      "symbol": "TL",
      "name": "Turkish Lira",
      "symbol_native": "TL",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TRY",
      "name_plural": "Turkish Lira",
      "numericCode": "949"
  },
  "TTD": {
      "symbol": "TT$",
      "name": "Trinidad and Tobago Dollar",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TTD",
      "name_plural": "Trinidad and Tobago dollars",
      "numericCode": "780"
  },
  "TWD": {
      "symbol": "NT$",
      "name": "New Taiwan Dollar",
      "symbol_native": "NT$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TWD",
      "name_plural": "New Taiwan dollars",
      "numericCode": "901"
  },
  "TZS": {
      "symbol": "TSh",
      "name": "Tanzanian Shilling",
      "symbol_native": "TSh",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "TZS",
      "name_plural": "Tanzanian shillings",
      "numericCode": "834"
  },
  "UAH": {
      "symbol": "₴",
      "name": "Ukrainian Hryvnia",
      "symbol_native": "₴",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "UAH",
      "name_plural": "Ukrainian hryvnias",
      "numericCode": "980"
  },
  "UGX": {
      "symbol": "USh",
      "name": "Ugandan Shilling",
      "symbol_native": "USh",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "UGX",
      "name_plural": "Ugandan shillings",
      "numericCode": "800"
  },
  "UYU": {
      "symbol": "$U",
      "name": "Uruguayan Peso",
      "symbol_native": "$",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "UYU",
      "name_plural": "Uruguayan pesos",
      "numericCode": "858"
  },
  "UZS": {
      "symbol": "UZS",
      "name": "Uzbekistan Som",
      "symbol_native": "UZS",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "UZS",
      "name_plural": "Uzbekistan som",
      "numericCode": "860"
  },
  "VEF": {
      "symbol": "Bs.F.",
      "name": "Venezuelan Bolívar",
      "symbol_native": "Bs.F.",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "VEF",
      "name_plural": "Venezuelan bolívars",
      "numericCode": "937"
  },
  "VND": {
      "symbol": "₫",
      "name": "Vietnamese Dong",
      "symbol_native": "₫",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "VND",
      "name_plural": "Vietnamese dong",
      "numericCode": "704"
  },
  "XAF": {
      "symbol": "FCFA",
      "name": "CFA Franc BEAC",
      "symbol_native": "FCFA",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "XAF",
      "name_plural": "CFA francs BEAC",
      "numericCode": "950"
  },
  "XOF": {
      "symbol": "CFA",
      "name": "CFA Franc BCEAO",
      "symbol_native": "CFA",
      "decimal_digits": 0,
      "rounding": 0,
      "code": "XOF",
      "name_plural": "CFA francs BCEAO",
      "numericCode": "952"
  },
  "YER": {
      "symbol": "YR",
      "name": "Yemeni Rial",
      "symbol_native": "ر.ي.‏",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "YER",
      "name_plural": "Yemeni rials",
      "numericCode": "886"
  },
  "ZAR": {
      "symbol": "R",
      "name": "South African Rand",
      "symbol_native": "R",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ZAR",
      "name_plural": "South African rand",
      "numericCode": "710"
  },
  "ZMW": {
      "symbol": "ZK",
      "name": "Zambian Kwacha",
      "symbol_native": "ZK",
      "decimal_digits": 2,
      "rounding": 0,
      "code": "ZMW",
      "name_plural": "Zambian kwachas",
      "numericCode": "967"
  }
};

export default currencies;