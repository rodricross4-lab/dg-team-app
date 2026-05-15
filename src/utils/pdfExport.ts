import jsPDF from 'jspdf';

export type PdfWorkoutExercise = {
  name: string;
  group: string;
  warmup?: string;
  feeder?: string;
  validSets?: string;
  reps?: string;
  rest?: string;
  notes?: string;
};

function header(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(224, 22, 22);
  doc.setFontSize(26);
  doc.text('DG TEAM', 14, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(title, 14, 34);

  doc.setTextColor(170, 170, 170);
  doc.setFontSize(10);
  doc.text(subtitle, 14, 42);

  doc.setDrawColor(224, 22, 22);
  doc.line(14, 48, 196, 48);
}

function footer(doc: jsPDF) {
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(9);
  doc.text('Método DG TEAM • Intensidade • Execução • Progressão', 14, 286);
}

export function exportWorkoutPdf(studentName: string, workoutName: string, exercises: PdfWorkoutExercise[]) {
  const doc = new jsPDF('p', 'mm', 'a4');
  header(doc, `Ficha de treino • ${workoutName}`, studentName);

  let y = 60;

  exercises.forEach((exercise, index) => {
    if (y > 250) {
      footer(doc);
      doc.addPage();
      header(doc, `Ficha de treino • ${workoutName}`, studentName);
      y = 60;
    }

    doc.setFillColor(16, 16, 16);
    doc.roundedRect(14, y - 8, 182, 34, 4, 4, 'F');

    doc.setTextColor(224, 22, 22);
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${exercise.name}`, 18, y);

    doc.setTextColor(220, 220, 220);
    doc.setFontSize(9);
    doc.text(`Grupo: ${exercise.group} • Válidas: ${exercise.validSets || '-'} • Reps: ${exercise.reps || '-'} • Descanso: ${exercise.rest || '-'}`, 18, y + 8);
    doc.text(`Aquecimento: ${exercise.warmup || '-'} • Ajuste: ${exercise.feeder || '-'}`, 18, y + 16);

    if (exercise.notes) {
      doc.setTextColor(165, 165, 165);
      doc.text(doc.splitTextToSize(`Obs: ${exercise.notes}`, 172), 18, y + 24);
    }

    y += 42;
  });

  footer(doc);
  doc.save(`DG_TEAM_${studentName}_${workoutName}.pdf`);
}

export function exportCycleSummaryPdf(studentName: string, summary: string[]) {
  const doc = new jsPDF('p', 'mm', 'a4');
  header(doc, 'Resumo do ciclo', studentName);

  let y = 62;
  summary.forEach((item) => {
    if (y > 260) {
      footer(doc);
      doc.addPage();
      header(doc, 'Resumo do ciclo', studentName);
      y = 62;
    }

    doc.setTextColor(235, 235, 235);
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(`• ${item}`, 174), 18, y);
    y += 14;
  });

  footer(doc);
  doc.save(`DG_TEAM_${studentName}_Resumo_Ciclo.pdf`);
}
