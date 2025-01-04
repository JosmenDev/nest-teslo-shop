import { v4 as uuid } from "uuid";
import { UuidService } from "../interfaces/uuid-service.interface";
export class UuidAdapter implements UuidService {
  generatedUuid(): string {
    return uuid();
  }
}