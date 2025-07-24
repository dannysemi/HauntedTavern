const characterFromEnv = (systemMessage: string, overwrite?: boolean): string => {    
  const characterPersona = process.env.CHARACTER_PERSONA?.trim() || "";

  if (!characterPersona) {
    return systemMessage;
  }

  const newSystemMessage = overwrite 
    ? characterPersona 
    : `${systemMessage}\n\n${characterPersona}`;

  return newSystemMessage;
}