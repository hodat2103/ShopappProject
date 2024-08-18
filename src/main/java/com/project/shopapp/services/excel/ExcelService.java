package com.project.shopapp.services.excel;

import com.project.shopapp.models.ExcelExportable;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
public class ExcelService implements ExcelServiceImpl {

    public void exportToExcel(List<? extends ExcelExportable> dataList, String fileName, HttpServletResponse response) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data");

            // Format row
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Format data
            CellStyle dataCellStyle = workbook.createCellStyle();
            dataCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Format date
            DataFormat format = workbook.createDataFormat();
            CellStyle dateCellStyle = workbook.createCellStyle();
            dateCellStyle.setDataFormat(format.getFormat("dd/MM/yyyy"));
            dateCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Export list from object
            int rowNum = 0;
            String[] columnHeaders = dataList.get(0).getColumnHeaders();
            Row headerRow = sheet.createRow(rowNum++);
            for (int i = 0; i < columnHeaders.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnHeaders[i]);
                cell.setCellStyle(headerStyle);
            }

            for (ExcelExportable obj : dataList) {
                Row row = sheet.createRow(rowNum++);
                Object[] rowData = obj.toExcelRow();
                for (int i = 0; i < rowData.length; i++) {
                    Cell cell = row.createCell(i);
                    if (rowData[i] instanceof String) {
                        cell.setCellValue((String) rowData[i]);
                        cell.setCellStyle(dataCellStyle);
                    } else if (rowData[i] instanceof Long) {
                        cell.setCellValue((Long) rowData[i]);
                        cell.setCellStyle(dataCellStyle);
                    } else if (rowData[i] instanceof Date) {
                        cell.setCellValue((Date) rowData[i]);
                        cell.setCellStyle(dateCellStyle);
                    } else if (rowData[i] instanceof Float) {
                        cell.setCellValue((Float) rowData[i]);
                        cell.setCellStyle(dataCellStyle);
                    } else if (rowData[i] instanceof Integer) {
                        cell.setCellValue((Integer) rowData[i]);
                        cell.setCellStyle(dataCellStyle);
                    } else if (rowData[i] instanceof Boolean) {
                        cell.setCellValue((Boolean) rowData[i] ? "1" : "0");
                        cell.setCellStyle(dataCellStyle);
                    } else if (rowData[i] instanceof byte[]) {
                        String value = new String((byte[]) rowData[i]);
                        cell.setCellValue(value);
                    }
                }
            }

            // Adjust width of columns
            for (int i = 0; i < columnHeaders.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Set content type and headers for response
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName + ".xlsx");

            // Write to response
            ServletOutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            outputStream.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
