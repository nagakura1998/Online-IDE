const editor = ace.edit('editor');
editor.session.setMode("ace/mode/bf");
editor.setValue("");
editor.clearSelection();
const Range = require("ace/range").Range;

const languageMap = {
    "cpp": {
        defaultCode: 
        "#include <iostream>\n"
        + "using namespace std;\n\n"
        + "int main() {\n"
        + '\tcout << "Hello World!";\n'
        + "\treturn 0;\n"
        + "}",
    },
    "java": {
        defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
    }`,
    },
    "python": {
        defaultCode: `print("Hello World!")`,
    },
    "javascript": {
        defaultCode: `console.log("Hello World!");`,
    }
}

$(window).on('beforeunload', function() { return ''; });
$(document).ready(() => {
    changeTheme();
    changeColor();
    changeLanguage();
});

function changeTheme(){
    const el= {
        editor: $("#editor")[0],
        output: $("#output")[0],
        input:  $("#input")[0],
        sel: {
            theme: $("#theme-sel")[0],
            color: $("#color-sel")[0],
            language: $("#language-sel")[0]
        },
    };
    let thsel = el.sel.theme;
    let theme = thsel.options[thsel.selectedIndex].value;
    editor.setTheme(`ace/theme/${theme}`);
    theme = ace.themeToClass(theme);
    [el.sel.theme, el.sel.color, el.sel.language, el.input, el.output, document.body]
    .forEach(e => { e.className = `ace-${theme}` });
}

function changeColor(){
    const el= {
        editor: $("#editor")[0],
        output: $("#output")[0],
        input:  $("#input")[0],
        sel: {
            theme: $("#theme-sel")[0],
            color: $("#color-sel")[0],
            language: $("#language-sel")[0]
        },
    };
    let clrsel = el.sel.color;
    document.documentElement.style.setProperty('--color', clrsel.options[clrsel.selectedIndex].value);
}

function changeLanguage(){
    const languageEl = document.querySelector("#language-sel");
    var language = languageEl.options[languageEl.selectedIndex].value;
    editor.setValue(languageMap[language].defaultCode);
}