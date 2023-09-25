import { builder } from "./builder";
import "./types/ApiToken";
import "./types/Collaborator";
import "./types/Invitation";
import "./types/Label";
import "./types/NotificationToken";
import "./types/Project";
import "./types/Reminder";
import "./types/Section";
import "./types/Task";
import "./types/TimePreset";
import "./types/User";

export const schema = builder.toSchema();
