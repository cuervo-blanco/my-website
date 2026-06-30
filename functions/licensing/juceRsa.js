function parseHexBigInt(hexString) {
  return BigInt(`0x${hexString || "0"}`);
}

function modPow(baseValue, exponentValue, modulusValue) {
  if (modulusValue === 1n) {
    return 0n;
  }

  let result = 1n;
  let base = baseValue % modulusValue;
  let exponent = exponentValue;

  while (exponent > 0n) {
    if ((exponent & 1n) === 1n) {
      result = (result * base) % modulusValue;
    }

    exponent >>= 1n;
    base = (base * base) % modulusValue;
  }

  return result;
}

function bytesToLittleEndianBigInt(buffer) {
  let value = 0n;

  for (let index = buffer.length - 1; index >= 0; index -= 1) {
    value = (value << 8n) + BigInt(buffer[index]);
  }

  return value;
}

function littleEndianBigIntToBuffer(value) {
  if (value <= 0n) {
    return Buffer.alloc(0);
  }

  const bytes = [];
  let remainingValue = value;

  while (remainingValue > 0n) {
    bytes.push(Number(remainingValue & 0xffn));
    remainingValue >>= 8n;
  }

  return Buffer.from(bytes);
}

function parseJuceRsaKey(keyText) {
  const trimmed = `${keyText || ""}`.trim();
  const separatorIndex = trimmed.indexOf(",");

  if (separatorIndex <= 0) {
    throw new Error("Invalid JUCE RSA key string.");
  }

  return {
    exponentOrPrivatePart: parseHexBigInt(trimmed.slice(0, separatorIndex)),
    modulus: parseHexBigInt(trimmed.slice(separatorIndex + 1)),
  };
}

function applyJuceRsaKeyToBuffer(buffer, keyText) {
  const key = parseJuceRsaKey(keyText);
  let value = bytesToLittleEndianBigInt(buffer);

  if (value <= 0n) {
    return Buffer.alloc(0);
  }

  let result = 0n;
  while (value !== 0n) {
    const remainder = value % key.modulus;
    value /= key.modulus;
    result =
      result * key.modulus +
      modPow(remainder, key.exponentOrPrivatePart, key.modulus);
  }

  return littleEndianBigIntToBuffer(result);
}

module.exports = {
  applyJuceRsaKeyToBuffer,
};
