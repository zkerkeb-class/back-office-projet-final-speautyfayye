export enum EEntityTypeId {
  track = 1,
  album = 2,
  artist = 3,
}

export async function uploadImage(
  entityTypeId: number,
  entityId: number,
  files: FileList,
): Promise<void> {
  try {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.delete('Content-Type');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}file/upload/${entityTypeId}/${entityId}`,
      {
        headers,
        method: 'POST',
        mode: 'cors',
        body: formData,
      },
    );

    if (response.ok) {
      window.location.reload();
    } else {
      throw new Error('error');
    }
  } catch (error) {
    console.error('🚀 ~ fetchAPi ~ error:', error);
    throw error;
  }
}

export async function uploadAudio(files: FileList): Promise<string> {
  try {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.delete('Content-Type');

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}audio/upload`, {
      headers,
      method: 'POST',
      mode: 'cors',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.data[0];
    } else {
      throw new Error('error');
    }
  } catch (error) {
    console.error('🚀 ~ fetchAPi ~ error:', error);
    throw error;
  }
}
