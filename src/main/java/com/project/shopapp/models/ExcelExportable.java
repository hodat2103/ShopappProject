package com.project.shopapp.models;

public interface ExcelExportable {
        Object[] toExcelRow();
        String[] getColumnHeaders();
}
