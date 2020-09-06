const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

//  This doesn't actually work
const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}/g;

const processMessages = (messages, file) => {
  const filtered = messages
    .flatMap(({ message }) =>
      (message.match(urlRegex) || [])
        .filter(m => m.search(/http|www/) > -1)
        .map(m => (m.startsWith('www') ? `https://${m}` : m))
    )
    .filter(({ length }) => length > 0);
  const data = Array.from(new Set(filtered)).sort();
  const fileName = `${path.basename(file, path.extname(file))}.json`;

  return writeFile(`json/${fileName}`, JSON.stringify(data, null, 2))
    .then(() => console.log(`[OK] [${messages.length} Messages] ${fileName}`))
    .catch(console.error);
};

processMessages(/* TODO: fill in */);
