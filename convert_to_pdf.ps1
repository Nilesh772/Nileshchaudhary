$docxPath = "c:\CoBrotherTech_Projects\master\All_Practicals_Documentation.docx"
$pdfPath = "c:\CoBrotherTech_Projects\master\All_Practicals_Documentation.pdf"

Write-Host "Opening Word application..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = [Microsoft.Office.Interop.Word.WdAlertLevel]::wdAlertsNone

try {
    Write-Host "Opening document: $docxPath"
    $doc = $word.Documents.Open($docxPath)
    Write-Host "Exporting to PDF: $pdfPath"
    $wdFormatPDF = 17
    $doc.SaveAs([ref]$pdfPath, [ref]$wdFormatPDF)
    $doc.Close([ref]0)
    Write-Host "Conversion completed successfully!"
}
catch {
    Write-Error "Error converting: $_"
}
finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
