const {getProgramFromFiles, buildGenerator} = require('typescript-json-schema');
const glob = require('glob');

// optionally pass argument to schema generator
const settings = {
    required: true,
    titles: true,
    topRef: true,
    ref: true,
    noExtraProps: true,
    ignoreErrors: false
};

const GLOB_SETTINGS = {
    ignore: ['**/node_modules/**'],
};


export async function getInterfaceSchema(searchPath: string, interfaceName: string) {
    const files = await getFiles(searchPath);

    const program = getProgramFromFiles(files);
    const generator = buildGenerator(program, settings);


    if (generator) {
        try {
            const schema = generator.getSchemaForSymbol(interfaceName, true);
            delete schema.$schema;
            return schema;
        } catch (e) {
            return null;
        }
    }
    throw new Error('No generator created');
}

function getFiles(searchPath: string): Promise<string[]> {
    return new Promise((res, rej) => {
        glob(searchPath, GLOB_SETTINGS, (err: Error | null, files: string[]) => {
            if (err) {
                return rej(err);
            }
            return res(files);
        });
    });
}
