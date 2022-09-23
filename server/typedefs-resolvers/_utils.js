import { readFileSync, writeFileSync } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

const getDirname = (metaUrl) => path.dirname(fileURLToPath(metaUrl));
const jsonFileFunc = ({ metaUrl, relativePath }) => ({
    getJSON: () =>
        JSON.parse(
            readFileSync(join(getDirname(metaUrl), relativePath)).toString()
        ),
    setJSON: (toDos) => {
        writeFileSync(
            join(getDirname(metaUrl), relativePath),
            JSON.stringify(toDos)
        );
    },
});

export { jsonFileFunc };
