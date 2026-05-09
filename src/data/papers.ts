export type Paper = {
  id: string;
  title: string;
  subject: string;
  code: string;
  branch: "CSE" | "ECE" | "ME" | "CE" | "EE" | "IT";
  semester: number;
  year: number;
  difficulty: "Easy" | "Medium" | "Hard";
  faculty: string;
  type: "Mid-Sem" | "End-Sem" | "Quiz" | "Re-Exam";
  pages: number;
  downloads: number;
  questions: string[];
};

const subjects: Array<Omit<Paper, "id" | "year" | "difficulty" | "faculty" | "type" | "pages" | "downloads" | "questions">> = [
  { title: "Database Management Systems", subject: "DBMS", code: "CS302", branch: "CSE", semester: 5 },
  { title: "Operating Systems", subject: "OS", code: "CS303", branch: "CSE", semester: 5 },
  { title: "Computer Networks", subject: "CN", code: "CS401", branch: "CSE", semester: 6 },
  { title: "Data Structures & Algorithms", subject: "DSA", code: "CS201", branch: "CSE", semester: 3 },
  { title: "Theory of Computation", subject: "TOC", code: "CS304", branch: "CSE", semester: 5 },
  { title: "Compiler Design", subject: "CD", code: "CS402", branch: "CSE", semester: 7 },
  { title: "Machine Learning", subject: "ML", code: "CS501", branch: "CSE", semester: 7 },
  { title: "Digital Signal Processing", subject: "DSP", code: "EC305", branch: "ECE", semester: 5 },
  { title: "Microprocessors", subject: "MP", code: "EC301", branch: "ECE", semester: 5 },
  { title: "Analog Electronics", subject: "AE", code: "EC202", branch: "ECE", semester: 3 },
  { title: "Thermodynamics", subject: "Thermo", code: "ME202", branch: "ME", semester: 3 },
  { title: "Fluid Mechanics", subject: "FM", code: "ME301", branch: "ME", semester: 5 },
  { title: "Structural Analysis", subject: "SA", code: "CE302", branch: "CE", semester: 5 },
  { title: "Power Systems", subject: "PS", code: "EE401", branch: "EE", semester: 7 },
  { title: "Control Systems", subject: "CS", code: "EE302", branch: "EE", semester: 5 },
  { title: "Web Technologies", subject: "WT", code: "IT401", branch: "IT", semester: 7 },
  { title: "Cryptography & Network Security", subject: "CNS", code: "IT502", branch: "IT", semester: 8 },
  { title: "Discrete Mathematics", subject: "DM", code: "MA201", branch: "CSE", semester: 3 },
];

const faculties = ["Dr. Mehta", "Prof. Iyer", "Dr. Kapoor", "Prof. Banerjee", "Dr. Rao", "Prof. Saxena", "Dr. Khan"];
const types: Paper["type"][] = ["Mid-Sem", "End-Sem", "Quiz", "Re-Exam"];
const difficulties: Paper["difficulty"][] = ["Easy", "Medium", "Hard"];
const years = [2019, 2020, 2021, 2022, 2023, 2024];

const sampleQs = [
  "Explain ACID properties with examples.",
  "Differentiate between paging and segmentation.",
  "Derive the time complexity of Quick Sort.",
  "Design a DFA for strings ending with '01'.",
  "Compare TCP vs UDP with use-cases.",
  "Construct a B+ tree of order 4 for given data.",
  "Solve the producer-consumer problem using semaphores.",
  "Explain back-propagation in neural networks.",
  "What is normalization? Convert to 3NF.",
  "Derive Bernoulli's equation from first principles.",
];

let counter = 1;
export const PAPERS: Paper[] = subjects.flatMap((s) =>
  years.map((y, i) => ({
    ...s,
    id: `pv-${(counter++).toString().padStart(4, "0")}`,
    year: y,
    difficulty: difficulties[(s.subject.length + i) % 3],
    faculty: faculties[(s.subject.length + i + y) % faculties.length],
    type: types[(i + s.semester) % types.length],
    pages: 4 + ((i + s.semester) % 6),
    downloads: 120 + ((s.subject.length * 31 + y * 7 + i * 53) % 4200),
    questions: sampleQs.slice(0, 6 + (i % 3)),
  })),
);

export const TRENDING = ["DBMS", "Operating Systems", "Machine Learning", "Compiler Design", "DSA"];
