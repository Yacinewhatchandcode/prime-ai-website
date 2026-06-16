$code = @'
using System;
using System.Text;
using System.Runtime.InteropServices;

public class Win32 {
    public delegate bool EnumDelegate(IntPtr hWnd, int lParam);

    [DllImport("user32.dll")]
    public static extern int EnumWindows(EnumDelegate lpEnumFunc, int lParam);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);
}
'@

Add-Type -TypeDefinition $code -ErrorAction SilentlyContinue

[Win32]::EnumWindows({
    param($hWnd, $lParam)
    $sb = New-Object System.Text.StringBuilder 1024
    [Win32]::GetWindowText($hWnd, $sb, 1024) | Out-Null
    $title = $sb.ToString()
    if (![string]::IsNullOrEmpty($title) -and [Win32]::IsWindowVisible($hWnd)) {
        Write-Host "Visible: $title"
    }
    $true
}, 0) | Out-Null
