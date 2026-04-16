const fs = require('fs');
const path = require('path');

/**
 * Industrial character-by-character SQL Parser for Wezume Data.
 * Performs a 5-way join on user, video, facial, speech, and total scoring.
 */
class SQLParser {
  constructor(filePath) {
    this.filePath = filePath;
    this.users = {};      // userId -> {firstName, lastName}
    this.facials = {};    // videoId -> { eye, smile, straight }
    this.speeches = {};   // videoId -> { emotion, energy, filler, pitch, rate, tone }
    this.totals = {};     // videoId -> { authenticity, clarity, confidence, emotional }
    this.candidates = []; // Resulting joined records
  }

  extractBlocks(sql, tableName) {
    const regex = new RegExp(`INSERT INTO \`${tableName}\` [^V]*VALUES\\s*`, 'g');
    let match;
    const blocks = [];
    while ((match = regex.exec(sql)) !== null) {
      let i = regex.lastIndex;
      let balance = 0;
      let currentBlock = "";
      let inString = false;
      while (i < sql.length) {
        const char = sql[i];
        const prevChar = sql[i-1];
        if (char === "'" && prevChar !== "\\") inString = !inString;
        if (!inString) {
          if (char === "(") balance++;
          if (char === ")") {
            balance--;
            if (balance === 0) {
              blocks.push(currentBlock);
              currentBlock = "";
              while (i < sql.length && sql[i] !== '(' && sql[i] !== ';') i++;
              if (sql[i] === ';') break;
              i--;
            }
          }
        }
        if (balance > 0 || (char === '(' && !inString)) {
           if (!(char === '(' && balance === 1 && !inString)) currentBlock += char;
        }
        i++;
      }
    }
    return blocks;
  }

  parseValues(block) {
    const values = [];
    let current = "";
    let inString = false;
    for (let i = 0; i < block.length; i++) {
      const char = block[i];
      const prevChar = block[i-1];
      if (char === "'" && prevChar !== "\\") inString = !inString;
      if (char === "," && !inString) {
        values.push(this.cleanValue(current));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(this.cleanValue(current));
    return values;
  }

  cleanValue(val) {
    val = val.trim();
    if (val === "NULL") return null;
    if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1).replace(/\\'/g, "'");
    return val;
  }

  parse() {
    if (!fs.existsSync(this.filePath)) return [];
    const sql = fs.readFileSync(this.filePath, 'utf8');

    console.log("Stage 1: Extracting Users...");
    this.extractBlocks(sql, 'user').forEach(b => {
      const v = this.parseValues(b);
      this.users[v[0]] = { firstName: v[7], lastName: v[13] };
    });

    console.log("Stage 2: Extracting Facial Scoring...");
    this.extractBlocks(sql, 'facial_scoring').forEach(b => {
      const v = this.parseValues(b);
      this.facials[v[6]] = { eye: v[2], smile: v[3], straight: v[4], total: v[5] };
    });

    console.log("Stage 3: Extracting Speech Scoring...");
    this.extractBlocks(sql, 'speech_score').forEach(b => {
      const v = this.parseValues(b);
      this.speeches[v[12]] = { 
        emotion: v[3], energy: v[4], filler: v[5], 
        pitch: v[6], structure: v[7], rate: v[8], tone: v[9], total: v[10]
      };
    });

    console.log("Stage 4: Extracting Total Scoring...");
    this.extractBlocks(sql, 'total_score').forEach(b => {
      const v = this.parseValues(b);
      this.totals[v[7]] = { 
        authenticity: v[1], clarity: v[2], confidence: v[3], emotional: v[4], total: v[6]
      };
    });

    console.log("Stage 5: Final Join (Videos)...");
    this.extractBlocks(sql, 'video').forEach(b => {
      const v = this.parseValues(b);
      const vid = v[0];
      const uid = v[5];
      
      const user = this.users[uid] || { firstName: "Candidate", lastName: uid };
      const facial = this.facials[vid] || {};
      const speech = this.speeches[vid] || {};
      const total = this.totals[vid] || {};

      this.candidates.push({
        legacyId: vid,
        name: `${user.firstName} ${user.lastName || ""}`.trim(),
        transcription: v[4],
        videoUrl: v[6],
        signals: {
          vc: parseFloat(facial.eye) || null,
          vs: parseFloat(facial.smile) || null,
          vf: parseFloat(facial.straight) || null,
          vemo: parseFloat(speech.emotion) || null,
          ve: parseFloat(speech.energy) || null,
          vfw: parseFloat(speech.filler) || null,
          vp: parseFloat(speech.pitch) || null,
          vr: parseFloat(speech.rate) || null,
          vt: parseFloat(speech.tone) || null
        },
        rawScores: {
          facialTotal: parseFloat(facial.total) || 0,
          speechTotal: parseFloat(speech.total) || 0,
          sentenceStructure: parseFloat(speech.structure) || 0,
          authenticity: parseFloat(total.authenticity) || 0,
          clarity: parseFloat(total.clarity) || 0,
          confidence: parseFloat(total.confidence) || 0,
          emotional: parseFloat(total.emotional) || 0,
          evalTotal: parseFloat(total.total) || 0
        }
      });
    });

    return this.candidates;
  }
}

const getLegacyCandidates = () => {
  const parser = new SQLParser(path.join(__dirname, '../../127_0_0_1.sql'));
  return parser.parse();
};

module.exports = { getLegacyCandidates };
