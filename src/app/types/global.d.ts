// types/global.d.ts

import type html2canvas from 'html2canvas';
import type { jsPDF } from 'jspdf';

declare global {
  interface Window {
    html2canvas: typeof html2canvas;
    jspdf: {
      jsPDF: typeof jsPDF;
    };
  }
}

export {};
