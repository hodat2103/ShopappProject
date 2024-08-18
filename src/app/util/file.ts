export function downloadFile(blob: Blob, fileName: string): void {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  }
  