class MockMMKV {
  constructor() {
    this.map = new Map();
  }
  setString(key, value) { this.map.set(key, String(value)); return true; }
  getString(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setMap(key, value) { this.map.set(key, JSON.stringify(value)); return true; }
  getMap(key) { const v = this.map.get(key); return v ? JSON.parse(v) : null; }
  setArray(key, value) { this.map.set(key, JSON.stringify(value)); return true; }
  getArray(key) { const v = this.map.get(key); return v ? JSON.parse(v) : null; }
  setBool(key, value) { this.map.set(key, Boolean(value)); return true; }
  getBool(key) { return this.map.has(key) ? Boolean(this.map.get(key)) : false; }
  setInt(key, value) { this.map.set(key, Number(value)); return true; }
  getInt(key) { return this.map.has(key) ? Number(this.map.get(key)) : 0; }
  removeItem(key) { this.map.delete(key); return true; }
  clearStore() { this.map.clear(); return true; }
  clearMemoryCache() { return true; }
}

const instances = new Map();

class MMKVLoader {
  constructor() {
    this.instanceId = 'default';
  }
  withInstanceID(id) {
    this.instanceId = id;
    return this;
  }
  withEncryption() {
    return this;
  }
  initialize() {
    if (!instances.has(this.instanceId)) {
      instances.set(this.instanceId, new MockMMKV());
    }
    return instances.get(this.instanceId);
  }
}

module.exports = {
  MMKVLoader,
};
