!include MUI2.nsh

Var DesktopShortcut
Var StartMenuShortcut

!define MUI_PAGE_CUSTOMFUNCTION_PRE ShowOptions
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

Function ShowOptions
    ; Очистка предыдущих выборов
    StrCpy $DesktopShortcut ""
    StrCpy $StartMenuShortcut ""

    ; Предоставить пользователю выбор
    MessageBox MB_YESNO "Вы хотите создать ярлык на рабочем столе?" IDYES +3
    StrCpy $DesktopShortcut "true"
    MessageBox MB_YESNO "Вы хотите создать ярлык в меню 'Пуск'?" IDYES +3
    StrCpy $StartMenuShortcut "true"
FunctionEnd

Section
    ; Создать ярлык на рабочем столе
    ${If} $DesktopShortcut == "true"
        CreateShortCut "$DESKTOP\My App.lnk" "$INSTDIR\My App.exe"
    ${EndIf}

    ; Создать ярлык в меню "Пуск"
    ${If} $StartMenuShortcut == "true"
        CreateShortCut "$SMPROGRAMS\My App.lnk" "$INSTDIR\My App.exe"
    ${EndIf}
SectionEnd
