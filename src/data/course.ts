export type CourseId = "i" | "k";

export const COURSE_STORAGE_KEY = "factory-visit:course";
export const DEFAULT_COURSE: CourseId = "i";

export const COURSE_LABELS: Record<CourseId, string> = {
    i: "電子",
    k: "国際",
};

export function detectCourseFromUrl(): CourseId | null {
    if (typeof window === "undefined") return null;

    const searchParams = new URLSearchParams(window.location.search);
    const paramSearch = searchParams.get("c")?.toLowerCase();
    if (paramSearch === "i" || paramSearch === "k") {
        return paramSearch;
    }

    if (window.location.hash.includes("?")) {
        const [, hashQuery] = window.location.hash.split("?");
        const hashParams = new URLSearchParams(hashQuery);
        const paramHash = hashParams.get("c")?.toLowerCase();
        if (paramHash === "i" || paramHash === "k") {
            return paramHash;
        }
    }

    return null;
}

export function getStoredCourse(): CourseId | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(COURSE_STORAGE_KEY)?.toLowerCase();
    if (stored === "i" || stored === "k") {
        return stored;
    }
    return null;
}

export function isCourseDetermined(): boolean {
    return Boolean(detectCourseFromUrl() || getStoredCourse());
}

export function getCurrentCourse(): CourseId {
    const urlCourse = detectCourseFromUrl();
    if (urlCourse) {
        localStorage.setItem(COURSE_STORAGE_KEY, urlCourse);
        return urlCourse;
    }

    const stored = getStoredCourse();
    if (stored) {
        return stored;
    }

    return DEFAULT_COURSE;
}

export const currentCourse = getCurrentCourse();

export function setCourse(course: CourseId, reload = true): void {
    localStorage.setItem(COURSE_STORAGE_KEY, course);

    if (reload && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (url.searchParams.has("c")) {
            url.searchParams.set("c", course);
        }
        if (window.location.hash.includes("?")) {
            const [hashPath, hashQuery] = window.location.hash.split("?");
            const hashParams = new URLSearchParams(hashQuery);
            if (hashParams.has("c")) {
                hashParams.set("c", course);
                window.location.hash = `${hashPath}?${hashParams.toString()}`;
            }
        }
        window.location.href = url.toString();
        window.location.reload();
    }
}
