/**
 * Mock AI Service for Hackathon Prototype
 * In a real implementation, this would call an Edge AI model or OpenAI API
 */

export interface AIParsedData {
  name: string;
  age: string;
  weight: string;
  flags: string[];
  riskScore: number;
}

export const processAmbientVoice = async (audioBlobOrText: string): Promise<AIParsedData> => {
  return new Promise((resolve) => {
    // Simulate network/processing delay
    setTimeout(() => {
      resolve({
        name: "Aarav",
        age: "36 Months",
        weight: "12kg",
        flags: ["Lethargy", "Speech Delay"],
        riskScore: 92,
      });
    }, 1500);
  });
};
