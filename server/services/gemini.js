const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME });
  }

  async generateItinerary(destination, departureLocation, startDate, endDate, budget, preferences) {
    try {
      const prompt = `Anda adalah perencana perjalanan profesional. Buat rencana perjalanan (itinerary) yang detail berdasarkan informasi berikut:

Tujuan: ${destination}
Lokasi Keberangkatan: ${departureLocation}
Tanggal Mulai: ${startDate}
Tanggal Selesai: ${endDate}
Budget: Rp ${budget}
Preferensi: ${JSON.stringify(preferences)}

Harap berikan itinerary hari demi hari dalam format JSON dengan struktur yang sama persis seperti ini:
{
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "title": "Nama aktivitas",
          "description": "Deskripsi singkat tentang aktivitas",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "duration": 120,
          "category": "sightseeing",
          "estimatedCost": 150000,
          "location": "Alamat lokasi spesifik",
          "tips": "Tips bermanfaat untuk aktivitas ini"
        }
      ]
    }
  ],
  "totalEstimatedCost": 2500000,
  "tips": ["Tips umum 1", "Tips umum 2"]
}

PENTING:
- Kembalikan HANYA JSON yang valid, tanpa format markdown (seperti \`\`\`json).
- Gunakan kategori: sightseeing, food, transport, hotel, activity, shopping, other.
- Durasi dalam hitungan menit.
- Semua konten teks (title, description, tips) HARUS dalam Bahasa Indonesia.
- Semua biaya (estimatedCost, totalEstimatedCost) HARUS dalam Rupiah (Rp) dan sesuai dengan budget.
- Sertakan 3-5 aktivitas per hari.
- Buat itinerary yang realistis dan praktis.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response - remove markdown code blocks if present
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '');
      cleanedText = cleanedText.replace(/```\n?/g, '');
      cleanedText = cleanedText.trim();

      // Parse JSON
      const itinerary = JSON.parse(cleanedText);

      return itinerary;
    } catch (error) {
      console.error('Gemini Service Error:', error);

      // If JSON parsing fails, return a default structure
      if (error instanceof SyntaxError) {
        throw new Error('Failed to parse AI response. Please try again.');
      }

      throw new Error('Failed to generate itinerary: ' + error.message);
    }
  }

  async optimizeRoute(activities) {
    try {
      const prompt = `Anda adalah seorang ahli optimasi rute. Berdasarkan aktivitas berikut, urutkan kembali agar rutenya paling efisien, dengan mempertimbangkan:
- Kedekatan geografis
- Jam buka dan waktu
- Alur aktivitas yang logis
- Waktu tempuh antar lokasi

Aktivitas:
${JSON.stringify(activities, null, 2)}

Kembalikan aktivitas yang sudah dioptimalkan dalam struktur JSON YANG SAMA, tapi urutannya diubah demi efisiensi.
Berikan HANYA respons JSON, tanpa penjelasan atau teks tambahan.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '');
      cleanedText = cleanedText.replace(/```\n?/g, '');
      cleanedText = cleanedText.trim();

      const optimized = JSON.parse(cleanedText);

      return optimized;
    } catch (error) {
      console.error('Gemini Optimize Error:', error);
      throw new Error('Failed to optimize route: ' + error.message);
    }
  }

  async getSuggestions(query) {
    try {
      const prompt = `Anda adalah asisten perjalanan yang membantu. Jawab pertanyaan terkait perjalanan ini secara ringkas dan praktis:

${query}

Berikan jawaban dalam Bahasa Indonesia yang membantu, akurat, dan fokus pada saran perjalanan yang praktis.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error) {
      console.error('Gemini Suggestion Error:', error);
      throw new Error('Failed to get suggestions: ' + error.message);
    }
  }

  async generateActivitySuggestions(destination, day, existingActivities = []) {
    try {
      const prompt = `Sarankan 5 aktivitas menarik untuk hari ke-${day} di ${destination}.

Aktivitas yang sudah ada (sebagai konteks):
${JSON.stringify(existingActivities, null, 2)}

Kembalikan saran dalam format JSON:
{
  "suggestions": [
    {
      "title": "Nama aktivitas",
      "description": "Deskripsi singkat",
      "category": "sightseeing/food/activity/other",
      "estimatedCost": 100000,
      "duration": 120,
      "bestTimeToVisit": "pagi/siang/malam"
    }
  ]
}

PENTING:
- Kembalikan HANYA JSON yang valid, tanpa markdown.
- Semua teks (title, description) harus dalam Bahasa Indonesia.
- Biaya 'estimatedCost' harus dalam Rupiah (Rp).`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '');
      cleanedText = cleanedText.replace(/```\n?/g, '');
      cleanedText = cleanedText.trim();

      const suggestions = JSON.parse(cleanedText);

      return suggestions;
    } catch (error) {
      console.error('Gemini Activity Suggestions Error:', error);
      throw new Error('Failed to generate activity suggestions: ' + error.message);
    }
  }

  async analyzeTripBudget(activities, totalBudget) {
    try {
      const totalCost = activities.reduce((sum, act) => sum + (act.cost || 0), 0);

      const prompt = `Analisis anggaran perjalanan ini:

Total Budget: Rp ${totalBudget}
Total Terpakai: Rp ${totalCost}
Sisa: Rp ${totalBudget - totalCost}

Aktivitas:
${JSON.stringify(activities, null, 2)}

Berikan analisis dalam Bahasa Indonesia:
1. Analisis anggaran (apakah lebih atau kurang dari budget)
2. Rincian pengeluaran per kategori (jika memungkinkan)
3. Saran penghematan biaya
4. Area di mana pengeluaran bisa dioptimalkan

Jaga agar respons tetap ringkas dan dapat ditindaklanjuti.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        analysis: text.trim(),
        totalBudget,
        totalSpent: totalCost,
        remaining: totalBudget - totalCost,
        status: totalCost > totalBudget ? 'over_budget' : 'within_budget'
      };
    } catch (error) {
      console.error('Gemini Budget Analysis Error:', error);
      throw new Error('Failed to analyze budget: ' + error.message);
    }
  }
}

module.exports = new GeminiService()