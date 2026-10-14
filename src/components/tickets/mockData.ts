import { Ticket, StaffMember } from "./types"

export const mockStaff: StaffMember[] = [
  { id: "staff-1", name: "Rahul Singh", department: "IT Desk", initials: "RS" },
  { id: "staff-2", name: "IT Desk", department: "IT Desk", initials: "IT" },
  { id: "staff-3", name: "R. Singh", department: "Maintenance", initials: "RS" },
  { id: "staff-4", name: "P. Kumar", department: "Facilities", initials: "PK" },
  { id: "staff-5", name: "A. Sharma", department: "Infrastructure", initials: "AS" },
]

export const initialTickets: Ticket[] = [
  {
    id: "#1044",
    title: "Wi-Fi AP offline in Lab 3",
    description:
      "Connection keeps dropping near Computer Lab 3. The access point has been unresponsive since Wednesday and students cannot connect during practicals.",
    category: "Infrastructure",
    department: "Infrastructure",
    status: "escalated",
    raisedBy: {
      name: "Arjun Verma",
      email: "25019cs102@glbitm.ac.in",
      initials: "AV",
    },
    assignedTo: {
      id: "staff-2",
      name: "IT Desk",
      department: "IT Desk",
      initials: "IT",
    },
    openedAt: "Oct 12, 10:30 AM",
    expectedReply: "Immediate dispatch",
    age: "52h",
    ageHours: 52,
    icon: "wifi",
    updates: [
      {
        id: "u-1",
        message: "Ticket submitted by Arjun Verma",
        timestamp: "Oct 12, 10:30 AM",
        type: "submitted",
      },
      {
        id: "u-2",
        message: "Assigned to IT Desk",
        timestamp: "Oct 12, 11:00 AM",
        type: "assigned",
      },
      {
        id: "u-3",
        message: "Unresolved for over 48 hours. Auto-escalated to admin desk.",
        timestamp: "Oct 14, 10:30 AM",
        type: "escalated",
      },
    ],
  },
  {
    id: "#1043",
    title: "Library portal timeout",
    description:
      "Digital library portal session timeout error occurs every few minutes, wiping active research queries and PDF annotations.",
    category: "IT Support",
    department: "IT Desk",
    status: "pending",
    raisedBy: {
      name: "Priya Nair",
      email: "25019it311@glbitm.ac.in",
      initials: "PN",
    },
    assignedTo: null,
    openedAt: "Today, 4:20 PM",
    expectedReply: "Within 24 hours",
    age: "6h",
    ageHours: 6,
    icon: "monitor",
    updates: [
      {
        id: "u-4",
        message: "Ticket submitted by Priya Nair",
        timestamp: "Today, 4:20 PM",
        type: "submitted",
      },
    ],
  },
  {
    id: "#1042",
    title: "Wi-Fi issue in Library",
    description:
      "Connection keeps dropping near the reading hall on the second floor. It happens every few minutes and affects most devices.",
    category: "IT and network",
    department: "IT Desk",
    status: "in_progress",
    raisedBy: {
      name: "Naman Sharma",
      email: "25019cs247@glbitm.ac.in",
      initials: "NS",
    },
    assignedTo: {
      id: "staff-1",
      name: "Rahul Singh",
      department: "IT Desk",
      initials: "RS",
    },
    openedAt: "Today, 7:42 PM",
    expectedReply: "Within 24 hours",
    age: "2h",
    ageHours: 2,
    icon: "wifi",
    updates: [
      {
        id: "u-5",
        message: "Ticket submitted by Naman Sharma",
        timestamp: "Today, 7:42 PM",
        type: "submitted",
      },
      {
        id: "u-6",
        message: "Assigned to Rahul Singh",
        timestamp: "Today, 8:10 PM",
        type: "assigned",
      },
      {
        id: "u-7",
        message:
          "Technician is checking the access point near the reading hall.",
        timestamp: "20 min ago",
        type: "in_progress",
      },
    ],
  },
  {
    id: "#1041",
    title: "Broken projector in Room 402",
    description:
      "HDMI port is loose and lamp flickers continuously in Room 402 during lectures.",
    category: "Classroom maintenance",
    department: "Maintenance",
    status: "resolved",
    raisedBy: {
      name: "Ankit Tiwari",
      email: "24019me012@glbitm.ac.in",
      initials: "AT",
    },
    assignedTo: {
      id: "staff-3",
      name: "R. Singh",
      department: "Maintenance",
      initials: "RS",
    },
    openedAt: "Yesterday, 11:15 AM",
    expectedReply: "Resolved",
    age: "1d",
    ageHours: 26,
    icon: "monitor",
    updates: [
      {
        id: "u-8",
        message: "Ticket submitted by Ankit Tiwari",
        timestamp: "Yesterday, 11:15 AM",
        type: "submitted",
      },
      {
        id: "u-9",
        message: "Assigned to R. Singh",
        timestamp: "Yesterday, 11:45 AM",
        type: "assigned",
      },
      {
        id: "u-10",
        message: "Replaced faulty HDMI port and calibrated projector brightness.",
        timestamp: "Yesterday, 3:30 PM",
        type: "in_progress",
      },
      {
        id: "u-11",
        message: "Marked as resolved",
        timestamp: "Yesterday, 5:00 PM",
        type: "resolved",
      },
    ],
  },
  {
    id: "#1040",
    title: "Water cooler not working",
    description:
      "Facilities water cooler on the second floor is not cooling water and leaking on the hallway floor.",
    category: "Facilities",
    department: "Facilities",
    status: "pending",
    raisedBy: {
      name: "Sneha Kapoor",
      email: "25019cs189@glbitm.ac.in",
      initials: "SK",
    },
    assignedTo: null,
    openedAt: "2d ago",
    expectedReply: "Within 48 hours",
    age: "2d",
    ageHours: 49,
    icon: "droplet",
    updates: [
      {
        id: "u-12",
        message: "Ticket submitted by Sneha Kapoor",
        timestamp: "2d ago",
        type: "submitted",
      },
    ],
  },
  {
    id: "#1039",
    title: "AC thermostat broken, Audi 1",
    description:
      "Air conditioner thermostat broken in Audi 1, temperature locked at lowest setting causing condensation.",
    category: "Maintenance",
    department: "Maintenance",
    status: "resolved",
    raisedBy: {
      name: "Rohan Das",
      email: "25019ec440@glbitm.ac.in",
      initials: "RD",
    },
    assignedTo: {
      id: "staff-3",
      name: "R. Singh",
      department: "Maintenance",
      initials: "RS",
    },
    openedAt: "3d ago",
    expectedReply: "Resolved",
    age: "3d",
    ageHours: 72,
    icon: "ticket",
    updates: [
      {
        id: "u-13",
        message: "Ticket submitted by Rohan Das",
        timestamp: "3d ago",
        type: "submitted",
      },
      {
        id: "u-14",
        message: "Assigned to R. Singh",
        timestamp: "3d ago",
        type: "assigned",
      },
      {
        id: "u-15",
        message: "Replaced digital wall controller and thermostat sensor.",
        timestamp: "2d ago",
        type: "in_progress",
      },
      {
        id: "u-16",
        message: "Marked as resolved",
        timestamp: "1d ago",
        type: "resolved",
      },
    ],
  },
]
