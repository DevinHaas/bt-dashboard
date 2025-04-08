import { addDays, eachDayOfInterval, subDays } from "date-fns"
import type { UserWithUploads } from "./api"

// Generate random date within the last 60 days
function randomRecentDate() {
  const daysAgo = Math.floor(Math.random() * 60)
  return subDays(new Date(), daysAgo)
}

// Generate random number of uploads (0-10)
function randomUploadCount() {
  return Math.floor(Math.random() * 11)
}

// Generate a pattern of uploads (e.g., every 2-3 days)
function generatePatternedUploads(userId: string, count: number) {
  const uploads = []
  const today = new Date()
  const startDate = subDays(today, 60) // Start from 60 days ago

  // Create a pattern - some users upload regularly, some sporadically
  const pattern = Math.random() > 0.5 ? "regular" : "sporadic"

  if (pattern === "regular") {
    // Regular pattern: every 2-5 days
    const interval = 2 + Math.floor(Math.random() * 4)
    let currentDate = startDate
    let uploadCount = 0

    while (currentDate <= today && uploadCount < count) {
      // 80% chance to upload on the scheduled day
      if (Math.random() < 0.8) {
        uploads.push({
          id: `upload-${userId}-${uploadCount}`,
          userId: userId,
          date: new Date(currentDate),
        })
        uploadCount++
      }

      currentDate = addDays(currentDate, interval)
    }
  } else {
    // Sporadic pattern: random clusters
    let remainingUploads = count

    // Create 2-4 clusters of uploads
    const clusterCount = 2 + Math.floor(Math.random() * 3)

    for (let i = 0; i < clusterCount && remainingUploads > 0; i++) {
      // Random cluster start within the 60 day period
      const clusterStart = subDays(today, Math.floor(Math.random() * 55))

      // Cluster lasts 1-3 days
      const clusterDuration = 1 + Math.floor(Math.random() * 3)
      const clusterEnd = addDays(clusterStart, clusterDuration)

      // Get all days in the cluster
      const clusterDays = eachDayOfInterval({
        start: clusterStart,
        end: clusterEnd,
      })

      // Add uploads for each day in the cluster
      for (const day of clusterDays) {
        if (remainingUploads <= 0) break

        // 1-2 uploads per day in the cluster
        const uploadsThisDay = 1 + Math.floor(Math.random() * 2)

        for (let j = 0; j < uploadsThisDay && remainingUploads > 0; j++) {
          uploads.push({
            id: `upload-${userId}-${uploads.length}`,
            userId: userId,
            date: new Date(day),
          })
          remainingUploads--
        }
      }
    }
  }

  // Sort by date descending
  return uploads.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// Generate mock user data
export function generateMockUsers(count = 20): UserWithUploads[] {
  const users = []

  for (let i = 0; i < count; i++) {
    const uploadCount = randomUploadCount()
    const userId = `user-${i}`
    const screenshotUploads = generatePatternedUploads(userId, uploadCount)

    users.push({
      id: `id-${i}`,
      clerk_id: userId, // Using userId as clerk_id for simplicity
      name: `User ${i}`,
      email: `user${i}@example.com`,
      uploadCount: screenshotUploads.length,
      lastUpload: screenshotUploads.length > 0 ? screenshotUploads[0].date : null,
      screenshotUploads,
    })
  }

  // Add some users with no uploads
  for (let i = 0; i < 5; i++) {
    users.push({
      id: `id-no-upload-${i}`,
      clerk_id: `no-upload-user-${i}`,
      name: `No Upload User ${i}`,
      email: `noupload${i}@example.com`,
      uploadCount: 0,
      lastUpload: null,
      screenshotUploads: [],
    })
  }

  // Add some users with old uploads
  for (let i = 0; i < 3; i++) {
    const oldDate = subDays(new Date(), 45 + i * 10)
    users.push({
      id: `id-old-upload-${i}`,
      clerk_id: `old-upload-user-${i}`,
      name: `Old Upload User ${i}`,
      email: `oldupload${i}@example.com`,
      uploadCount: 1,
      lastUpload: oldDate,
      screenshotUploads: [
        {
          id: `old-upload-${i}`,
          userId: `old-upload-user-${i}`,
          date: oldDate,
        },
      ],
    })
  }

  return users
}

