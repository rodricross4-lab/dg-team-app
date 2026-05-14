import jsPDF from 'jspdf';

export type WeeklyReport = {
  studentName: string;
  week: string;
  goal: string;
  validSets: number;
  volumeLoad: number;
  frequency: string;
  notes: string[];
};

export function exportWeeklyPdf(report: WeeklyReport): void {
  const pdf = new jsPDF();
  pdf.setFillColor(5, 5, 5);
  pdf.rect(0, 0, 210, 297, 'F');

  pdf.setTextColor(224, 22, 22);
  pdf.setFontSize(24);
  pdf.text('DG TEAM', 14, 22);

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.text(`Relatório semanal - ${report.week}`, 14, 38);

  pdf.setFontSize(12);
  pdf.text(`Aluno: ${report.studentName}`, 14, 55);
  pdf.text(`Objetivo: ${report.goal}`, 14, 65);
  pdf.text(`Séries válidas: ${report.validSets}`, 14, 75);
  pdf.text(`Volume load: ${report.volumeLoad} kg`, 14, 85);
  pdf.text(`Frequência: ${report.frequency}`, 14, 95);

  pdf.setTextColor(224, 22, 22);
  pdf.text('Observações IA DG:', 14, 115);

  pdf.setTextColor(255, 255, 255);
  report.notes.forEach((note, index) => {
    pdf.text(`- ${note}`, 14, 128 + index * 10);
  });

  pdf.save(`DG-TEAM-${report.studentName}-${report.week}.pdf`);
}
