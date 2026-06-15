export type HrDocType = "offer" | "appointment" | "relieving" | "experience";

export type HrFields = {
  employeeName: string;
  designation: string;
  salary: string;
  joiningDate: string;
  issueDate: string;
  lastDate: string;
  place: string;
  signatory: string;
  signatoryTitle: string;
};

export const HR_DOC_LABELS: Record<HrDocType, string> = {
  offer: "Offer Letter",
  appointment: "Appointment Letter",
  relieving: "Relieving Letter",
  experience: "Experience Letter",
};

export function emptyHr(): HrFields {
  return {
    employeeName: "",
    designation: "",
    salary: "",
    joiningDate: "",
    issueDate: new Date().toISOString().slice(0, 10),
    lastDate: "",
    place: "New Delhi",
    signatory: "",
    signatoryTitle: "Director",
  };
}

const fmt = (d: string) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "____________");

export function hrSubject(type: HrDocType): string {
  return HR_DOC_LABELS[type];
}

export function hrBody(type: HrDocType, f: HrFields): string[] {
  const name = f.employeeName || "____________";
  const role = f.designation || "____________";
  const salary = f.salary || "____________";
  if (type === "offer") {
    return [
      `Dear ${name},`,
      `We are pleased to offer you the position of ${role} at Maple Furnishers. We were impressed with your background and believe you will be a valuable addition to our team.`,
      `Your total compensation will be ${salary}, and your expected date of joining is ${fmt(f.joiningDate)}. The detailed terms and conditions of your employment will be shared in your appointment letter on joining.`,
      `This offer is contingent upon verification of your documents and references. We look forward to welcoming you to Maple Furnishers.`,
    ];
  }
  if (type === "appointment") {
    return [
      `Dear ${name},`,
      `With reference to your application and subsequent discussions, we are pleased to appoint you as ${role} at Maple Furnishers with effect from ${fmt(f.joiningDate)}.`,
      `Your total compensation will be ${salary}. You will be governed by the policies, rules and regulations of the company as applicable from time to time, and any amendments thereto.`,
      `We are confident that your association with Maple Furnishers will be long and mutually rewarding. Please sign and return the duplicate copy of this letter as a token of your acceptance.`,
    ];
  }
  if (type === "relieving") {
    return [
      `To Whomsoever It May Concern,`,
      `This is to certify that ${name} was employed with Maple Furnishers as ${role} from ${fmt(f.joiningDate)} to ${fmt(f.lastDate)}.`,
      `He/She has been relieved from the services of the company with effect from the close of business hours on ${fmt(f.lastDate)}, and there are no dues pending against him/her.`,
      `We thank ${name} for the contribution during the tenure with us and wish him/her success in all future endeavours.`,
    ];
  }
  return [
    `To Whomsoever It May Concern,`,
    `This is to certify that ${name} worked with Maple Furnishers as ${role} from ${fmt(f.joiningDate)} to ${fmt(f.lastDate)}.`,
    `During the tenure with us, ${name} was found to be sincere, hardworking and professional in approach. His/Her conduct and performance were found to be satisfactory.`,
    `We wish ${name} the very best for all future endeavours.`,
  ];
}
