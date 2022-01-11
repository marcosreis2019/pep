import { Injectable } from '@angular/core'
import { Workbook } from 'exceljs'
import * as fs from 'file-saver'
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() {}

  async generateExcel(
    title: string,
    header: string[],
    data: string[][],
    widthColumn: number[],
    name: string = 'RelatorioAtendimentos'
  ) {
    // const ExcelJS = await import('exceljs');
    // const Workbook: any = {};

    // Create workbook and worksheet
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Relatório')

    // Add Row and formatting
    if (title !== '') {
      const titleRow = worksheet.addRow([title])
      titleRow.font = {
        name: 'Comic Sans MS',
        family: 4,
        size: 16,
        underline: 'double',
        bold: true
      }
      worksheet.addRow([])
    }
    //const subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);

    //Add logo
    //worksheet.addImage(logo, 'E1:F3');
    //Merge cells
    //worksheet.mergeCells('A1:D2');

    // Blank Row
    //worksheet.addRow([]);

    // Add Header Row
    const headerRow = worksheet.addRow(header)

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      //cell.fill = {
      //  type: 'pattern',
      //  pattern: 'solid',
      //  fgColor: { argb: 'FFFFFF00' }
      //};
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
    // worksheet.addRows(data);

    // Add Data and Conditional Formatting
    data.forEach(d => {
      const row = worksheet.addRow(d)
    })

    for (let i = 0; i < widthColumn.length; i++) {
      worksheet.getColumn(i + 1).width = widthColumn[i]
      worksheet.addRow([])
    }

    // Footer Row
    // const footerRow = worksheet.addRow(['This is system generated excel sheet.']);
    //  footerRow.getCell(1).fill = {
    // type: 'pattern',
    //  pattern: 'solid',
    //  fgColor: { argb: 'FFCCFFE5' }
    //};
    //  footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // Merge Cells
    //  worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      fs.saveAs(blob, `${name}.xlsx`)
    })
  }
}
