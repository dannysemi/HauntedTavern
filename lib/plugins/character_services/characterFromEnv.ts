// lib/plugins/character_services/characterFromEnv.ts
import { CharacterProcessor, SystemMessage } from "../types";

export const CharacterService: CharacterProcessor = {
  processCharacter(systemMessage: string, overwrite?: boolean): SystemMessage {
    const characterPersona = process.env.CHARACTER_PERSONA?.trim() || "";
    
    if (!characterPersona) {
      return { systemMessage };
    }

    const newSystemMessage = overwrite 
      ? characterPersona 
      : `${systemMessage}\n\n${characterPersona}`;

    return { systemMessage: newSystemMessage };
  }
}