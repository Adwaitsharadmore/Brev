export async function uploadFileWithRetry(filePath, options, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const uploadResponse = await fileManager.uploadFile(filePath, options);
      return uploadResponse;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}