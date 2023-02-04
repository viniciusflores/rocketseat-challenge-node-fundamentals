import fs from 'fs';
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/tasks.csv`)
    .pipe(parse({
      columns: true
    }));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
};


(async () => {
  const tasks = await processFile();

  for await (const task of tasks){
    fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify(task)
      })
      .then(response => {
        response.text().then(data => {
          console.log(data)
        })
      })
  }
})();
