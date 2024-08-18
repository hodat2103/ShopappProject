package com.project.shopapp.services.excel;

import com.project.shopapp.models.ExcelExportable;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

public interface ExcelServiceImpl {
     void exportToExcel(List<? extends ExcelExportable> dataList, String fileName, HttpServletResponse response);
}
