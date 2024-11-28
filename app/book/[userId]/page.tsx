import { Suspense } from "react";
import { BookingPageClient } from "./booking-page-client";
import { Loader2 } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// This is a server component
export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <BookingPageClient />
    </Suspense>
  );
}

// This function runs on the server at build time
export async function generateStaticParams() {
  try {
    // Fetch all user IDs from Firestore
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map((doc) => ({
      userId: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    // Return an empty array if there's an error
    return [];
  }
}