import { Project, StructureKind, ts, CodeBlockWriter, TypeChecker } from "ts-morph";
import * as m from "ts-morph";
import * as path from 'path';

// initialize
const project = new Project({
    // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
    // If you initialize with a tsconfig.json, then it will automatically populate the project
    // with the associated source files.
    // Read more: https://ts-morph.com/setup/
});

function searchForBase(smth: m.Type<ts.Type>) {

}
const typeChecker = project.getTypeChecker();
// add source files
const writer = new CodeBlockWriter();
const writeFile = project.createSourceFile('./ui.ts', '', { overwrite: true });
for (const file of project.addSourceFilesAtPaths('src/ui/*.ui/index.ts')) {
    for (const class_ of file.getClasses()) {
        const methods = class_.getMethods();
        if (methods.length === 0) continue;
        // TODO: to pascal case
        writer.writeLine(`interface I${class_.getName()}Methods {`);
        for (const method of methods) {
            if (!method.getDecorator('requestable')) continue;
            const parameters = method.getParameters()
                .map((parameter) => `${parameter.getName()}: ${parameter.getType().getText()}`)
                .join(', ');
            const methodName = method.getName();
            const returnType = method.getReturnType().getText();
            const resolvedSignature = typeChecker.getTypeText(method.getType());
            // const test = method.getReturnType().getSymbol().getDeclarations()[0].getText();
            // const test = method.getReturnType().getSymbol().getDeclarations()[0].getType().;
            // console.log('123', test)
            console.log('resolvedSignature', resolvedSignature)
            const text = typeChecker.getTypeText(method.getType());
            // const text = `${methodName}: (${parameters}) => ${returnType};`
            writer.tab(1).write(text).newLine();
        }
        writer.writeLine('}').newLine();
    }
}
console.log(writer.toString());
// const classes = files[0].getClasses();
// const methods = classes[0].getMethods();
// const isRequestable = methods[0].getDecorator('requestable');
// console.log('asd', methods[0].print());
// console.log('params', methods[0].getParameters());
// console.log('return', methods[0].getReturnType().getText());

// const fnDec = writeFile.addFunction({
//     name: methods[0].getName(),
//     parameters: methods[0].getParameters().map((o) => ({ name: o.getName(), type: o.getType().getText() })),
//     returnType: methods[0].getReturnType().getText(),
//     hasDeclareKeyword: true,
// });
// console.log('fnDec', fnDec.getType().getText())

// const writer = new CodeBlockWriter();

// let method = methods[0];
// const parameters = method.getParameters().map((parameter) => {
//     return `${parameter.getName()}: ${parameter.getType().getText()}`
// }).join(', ');
// let IName = 'ISettingsUiMethods';
// let methodName = method.getName();
// let returnType = method.getReturnType().getText();
// writer
//     .write(`interface ${IName}`)
//     .block(() => {
//         writer.writeLine(`${methodName}: (${parameters}) => ${returnType};`)
//     })
//     .writeLine('')
// console.log(writer.toString());

// writeFile.addInterface({
//     name: IName,
//     isExported: true,
//     properties: [
//         {
//             name: methods[0].getName(),
//             type: fnDec.getType().getText(),
//         }
//     ]
// })

// writeFile.saveSync();
console.log('END__END__END__END__END__END__END__END__END__END')
