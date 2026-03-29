import jsPDF from "jspdf";

export const generateMoodReport = (insight) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("MindTuneX Mood Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Total Entries: ${insight?.totalEntries || 0}`, 20, 40);
  doc.text(`Average Sentiment: ${insight?.avgSentiment || "N/A"}`, 20, 50);
  doc.text(`Top Emotion: ${insight?.topEmotion || "N/A"}`, 20, 60);
  doc.text(`Summary: ${insight?.summaryText || "No summary available"}`, 20, 80, {
    maxWidth: 160,
  });

  doc.save("MindTuneX_Mood_Report.pdf");
};