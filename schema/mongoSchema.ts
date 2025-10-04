import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

export interface AdministratorInterface {
  id: string;
  username: string;
  name: string;
  password: string;
  image: string;
  imagename: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  role: "super" | "normal";
  datecreated: Date;
}

export interface CategoryInterface {
  id: string;
  categoryname: string;
}

export interface JobInterface {
  id: string;
  overview: string;
  position: string;
  salary: string;
  featured: boolean;
  company: string;
  website?: string;
  duration: "Full Time" | "Part Time";
  location: string;
  post: string;
  author: string;
  jobcategory: string;
  datecreated?: Date;
}

export interface MailInterface {
  id: string;
  receiver: string;
  subject: string;
  message: string;
  datecreated?: Date;
}

enum ScholarshipType {
  FullyFunded = "Fully Funded",
  PartiallyFunded = "Partially Funded",
}

enum ProgramType {
  AllLevels = "All Levels",
  Bachelors = "Bachelors Degree",
  Masters = "Masters Degree",
  Doctorate = "Doctorate Degree",
  PostGrad = "Post Graduate Diploma",
}

enum ScholarshipCategory {
  Government = "Government",
  Private = "Private",
  Organizational = "Organizational",
  International = "International",
  Research = "Research",
}

type Country =
  | "Afghanistan"
  | "Albania"
  | "Algeria"
  | "Andorra"
  | "Angola"
  | "Antigua & Deps"
  | "Argentina"
  | "Armenia"
  | "Australia"
  | "Austria"
  | "Azerbaijan"
  | "Bahamas"
  | "Bahrain"
  | "Bangladesh"
  | "Barbados"
  | "Belarus"
  | "Belgium"
  | "Belize"
  | "Benin"
  | "Bhutan"
  | "Bolivia"
  | "Bosnia Herzegovina"
  | "Botswana"
  | "Brazil"
  | "Brunei"
  | "Bulgaria"
  | "Burkina"
  | "Burundi"
  | "Cambodia"
  | "Cameroon"
  | "Canada"
  | "Cape Verde"
  | "Central African Rep"
  | "Chad"
  | "Chile"
  | "China"
  | "Colombia"
  | "Comoros"
  | "Congo"
  | "Congo {Democratic Rep}"
  | "Costa Rica"
  | "Croatia"
  | "Cuba"
  | "Cyprus"
  | "Czech Republic"
  | "Denmark"
  | "Djibouti"
  | "Dominica"
  | "Dominican Republic"
  | "East Timor"
  | "Ecuador"
  | "Egypt"
  | "El Salvador"
  | "Equatorial Guinea"
  | "Eritrea"
  | "Estonia"
  | "Ethiopia"
  | "Fiji"
  | "Finland"
  | "France"
  | "Gabon"
  | "Gambia"
  | "Georgia"
  | "Germany"
  | "Ghana"
  | "Greece"
  | "Grenada"
  | "Guatemala"
  | "Guinea"
  | "Guinea-Bissau"
  | "Guyana"
  | "Haiti"
  | "Honduras"
  | "Hungary"
  | "Iceland"
  | "India"
  | "Indonesia"
  | "Iran"
  | "Iraq"
  | "Ireland {Republic}"
  | "Israel"
  | "Italy"
  | "Ivory Coast"
  | "Jamaica"
  | "Japan"
  | "Jordan"
  | "Kazakhstan"
  | "Kenya"
  | "Kiribati"
  | "Korea North"
  | "Korea South"
  | "Kosovo"
  | "Kuwait"
  | "Kyrgyzstan"
  | "Laos"
  | "Latvia"
  | "Lebanon"
  | "Lesotho"
  | "Liberia"
  | "Libya"
  | "Liechtenstein"
  | "Lithuania"
  | "Luxembourg"
  | "Macedonia"
  | "Madagascar"
  | "Malawi"
  | "Malaysia"
  | "Maldives"
  | "Mali"
  | "Malta"
  | "Marshall Islands"
  | "Mauritania"
  | "Mauritius"
  | "Mexico"
  | "Micronesia"
  | "Moldova"
  | "Monaco"
  | "Mongolia"
  | "Montenegro"
  | "Morocco"
  | "Mozambique"
  | "Myanmar, {Burma}"
  | "Namibia"
  | "Nauru"
  | "Nepal"
  | "Netherlands"
  | "New Zealand"
  | "Nicaragua"
  | "Niger"
  | "Nigeria"
  | "Norway"
  | "Oman"
  | "Pakistan"
  | "Palau"
  | "Panama"
  | "Papua New Guinea"
  | "Paraguay"
  | "Peru"
  | "Philippines"
  | "Poland"
  | "Portugal"
  | "Qatar"
  | "Romania"
  | "Russian Federation"
  | "Rwanda"
  | "St Kitts & Nevis"
  | "St Lucia"
  | "Saint Vincent & the Grenadines"
  | "Samoa"
  | "San Marino"
  | "Sao Tome & Principe"
  | "Saudi Arabia"
  | "Senegal"
  | "Serbia"
  | "Seychelles"
  | "Sierra Leone"
  | "Singapore"
  | "Slovakia"
  | "Slovenia"
  | "Solomon Islands"
  | "Somalia"
  | "South Africa"
  | "South Sudan"
  | "Spain"
  | "Sri Lanka"
  | "Sudan"
  | "Suriname"
  | "Swaziland"
  | "Sweden"
  | "Switzerland"
  | "Syria"
  | "Taiwan"
  | "Tajikistan"
  | "Tanzania"
  | "Thailand"
  | "Togo"
  | "Tonga"
  | "Trin_idad & Tobago"
  | "Tunisia"
  | "Turkey"
  | "Turkmenistan"
  | "Tuvalu"
  | "Uganda"
  | "Ukraine"
  | "United Arab Emirates"
  | "United Kingdom"
  | "United States"
  | "Uruguay"
  | "Uzbekistan"
  | "Vanuatu"
  | "Vatican City"
  | "Venezuela"
  | "Vietnam"
  | "Yemen"
  | "Zambia"
  | "Zimbabwe";

export interface ScholarshipInterface {
  id: string;
  scholarshipname: string;
  deadline: Date;
  description: string;
  scholarshiptype: ScholarshipType;
  programs: ProgramType;
  scholarshipcategory: ScholarshipCategory;
  featured: boolean;
  country: Country;
  website: string;
  post: string;
  author: string;
  datecreated?: Date;
}

export interface SubscriberInterface {
  id: string;
  email: string;
}

const administratorSchema = new Schema<AdministratorInterface>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  imagename: { type: String, required: true },
  twitter: { type: String, required: true },
  facebook: { type: String, required: true },
  linkedin: { type: String, required: true },
  role: { type: String, required: true, enum: ["super", "normal"] },
  datecreated: { type: Date, required: true, default: new Date() },
});

const categorySchema = new Schema<CategoryInterface>({
  id: { type: String, required: true, unique: true },
  categoryname: String,
});

const jobsSchema = new Schema<JobInterface>({
  id: { type: String, required: true, unique: true },
  overview: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: String, required: true },
  featured: { type: Boolean, required: true },
  company: { type: String, required: true },
  website: { type: String },
  duration: { type: String, enum: ["Full Time", "Part Time"], required: true },
  location: { type: String, required: true },
  post: { type: String, required: true },
  author: { type: String, required: true },
  jobcategory: { type: String, required: true },
  datecreated: { type: Date, default: new Date() },
});

const mailMessagesSchema = new Schema<MailInterface>({
  id: { type: String, required: true, unique: true },
  receiver: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  datecreated: { type: Date, default: new Date() },
});

const scholarshipSchema = new Schema<ScholarshipInterface>({
  id: { type: String, required: true, unique: true },
  scholarshipname: { type: String, required: true },
  deadline: { type: Date, default: new Date() },
  description: { type: String, required: true },
  scholarshiptype: {
    type: String,
    required: true,
    enum: ["Fully Funded", "Partially Funded"],
  },
  programs: {
    type: String,
    required: true,
    enum: [
      "All Levels",
      "Bachelors Degree",
      "Masters Degree",
      "Doctorate Degree",
      "Post Graduate Diploma",
    ],
  },
  scholarshipcategory: {
    type: String,
    required: true,
    enum: [
      "Government",
      "Private",
      "Organizational",
      "International",
      "Research",
    ],
  },
  country: {
    type: String,
    required: true,
    enum: [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua & Deps",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cape Verde",
      "Central African Rep",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Congo {Democratic Rep}",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "East Timor",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland {Republic}",
      "Israel",
      "Italy",
      "Ivory Coast",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea North",
      "Korea South",
      "Kosovo",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macedonia",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar, {Burma}",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russian Federation",
      "Rwanda",
      "St Kitts & Nevis",
      "St Lucia",
      "Saint Vincent & the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome & Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Swaziland",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Togo",
      "Tonga",
      "Trin_idad & Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ],
  },
  featured: { type: Boolean, required: true },
  website: { type: String, required: true },
  post: { type: String, required: true },
  author: { type: String, required: true },
  datecreated: { type: Date, default: new Date() },
});

const subscribersSchema = new Schema<SubscriberInterface>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, lowercase: true },
});

const adminModel =
  models.Administrator ||
  model<AdministratorInterface>("Administrator", administratorSchema);

const categoryModel =
  models.Category || model<CategoryInterface>("Category", categorySchema);

const jobModel = models.Job || model<JobInterface>("Job", jobsSchema);

const mailMessagesModel =
  models.MailMessages ||
  model<MailInterface>("MailMessages", mailMessagesSchema);

const scholarshipModel =
  models.Scholarship ||
  model<ScholarshipInterface>("Scholarship", scholarshipSchema);

const subscribersModel =
  models.Subscriber ||
  model<SubscriberInterface>("Subscriber", subscribersSchema);

export {
  adminModel,
  categoryModel,
  jobModel,
  mailMessagesModel,
  scholarshipModel,
  subscribersModel,
};
