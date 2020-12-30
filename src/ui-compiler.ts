import { Project, StructureKind } from "ts-morph";
import * as path from 'path';

// initialize
const project = new Project({
    // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
    // If you initialize with a tsconfig.json, then it will automatically populate the project
    // with the associated source files.
    // Read more: https://ts-morph.com/setup/
});

// add source files

const files = project.addSourceFilesAtPaths('src/ui/*.ui/index.ts');
const classes = files[0].getClasses();
const methods = classes[0].getMethods();
const writeFile = project.createSourceFile('./ui.ts');
const isRequestable = methods[0].getDecorator('requestable');
// console.log('asd', methods[0].print());
// console.log('params', methods[0].getParameters());
// console.log('return', methods[0].getReturnType().getText());

const fnDec = writeFile.addFunction({
    name: methods[0].getName(),
    parameters: methods[0].getParameters().map((o) => ({ name: o.getName(), type: o.getType().getText() })),
    returnType: methods[0].getReturnType().getText(),
    hasDeclareKeyword: true,
});
console.log('fnDec', fnDec.getType().getText())

writeFile.addInterface({
    name: 'ISettingsUiMethods',
    isExported: true,
    properties: [
        {
            name: methods[0].getName(),
            type: fnDec.getType().getText(),
        }
    ]
})

writeFile.saveSync();
console.log('END__END__END__END__END__END__END__END__END__END')
