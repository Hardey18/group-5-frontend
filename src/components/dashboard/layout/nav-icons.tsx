import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ArrowsClockwise";
import { ChartPieIcon } from "@phosphor-icons/react/dist/ssr/ChartPie";
import { ChatIcon } from "@phosphor-icons/react/dist/ssr/Chat";
import { DatabaseIcon } from "@phosphor-icons/react/dist/ssr/Database";
import { GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix";
import { PhoneIcon } from "@phosphor-icons/react/dist/ssr/Phone";
import { PlugsConnectedIcon } from "@phosphor-icons/react/dist/ssr/PlugsConnected";
import { SirenIcon } from "@phosphor-icons/react/dist/ssr/Siren";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { UserCirclePlusIcon } from "@phosphor-icons/react/dist/ssr/UserCirclePlus";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import { XSquare } from "@phosphor-icons/react/dist/ssr/XSquare";

export const navIcons = {
	"chart-pie": ChartPieIcon,
	"follow-up": ArrowsClockwiseIcon,
	dashboard: DatabaseIcon,
	call: PhoneIcon,
	chat: ChatIcon,
	client: UserCirclePlusIcon,
	"churn-list": SirenIcon,
	"gear-six": GearSixIcon,
	"plugs-connected": PlugsConnectedIcon,
	"x-square": XSquare,
	user: UserIcon,
	users: UsersIcon,
} as Record<string, Icon>;
