import { useRef, useState, useEffect } from "react";
import { Alert, View, StyleSheet, ActivityIndicator, Pressable, Text, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const API = process.env.EXPO_PUBLIC_API_BASE!;

export default function CameraScreen() {
  const [perm, requestPermission] = useCameraPermissions();
  const camRef = useRef<any>(null);

  const [origUri, setOrigUri] = useState<string | null>(null);
  const [cutoutB64, setCutoutB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!perm?.granted && perm?.canAskAgain) requestPermission();
  }, [perm]);

  if (!perm) return null;

  if (!perm.granted) {
    return (
      <View style={styles.center}>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Camera Permission</Text>
        </Pressable>
      </View>
    );
  }

  const capture = async () => {
    try {
      setLoading(true);
      const photo = await camRef.current?.takePictureAsync({ quality: 0.9, skipProcessing: true });
      if (!photo?.uri) throw new Error("no photo");
      setOrigUri(photo.uri);

        const fd = new FormData();
        fd.append("image", { uri: photo.uri, name: "photo.jpg", type: "image/jpeg" } as any);
            
        const res = await fetch(`${API}/api/preview`, { method: "POST", body: fd });
        const text = await res.text();
        console.log("preview", { status: res.status, ctype: res.headers.get("content-type") });
        console.log("preview first 120:", text.slice(0, 120));
            
        if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0,120)}`);
            
        // ---- robust extract without JSON.parse ----
        let b64: string | null = null;
            
        if (text.startsWith("data:image/png;base64,")) {
          b64 = text.split(",")[1];
        } else {
          // grab the value of "png_base64":"...".
          const m = text.match(/"png_base64"\s*:\s*"([^"]+)"/);
          if (m) b64 = m[1];
          else {
            // fallback: entire body is plain base64
            const maybe = text.trim();
            if (/^[A-Za-z0-9+/=]+$/.test(maybe)) b64 = maybe;
          }
        }
        
        if (!b64) throw new Error("could not extract base64 from preview response");
        setCutoutB64(b64);
        setOrigUri(photo.uri);

      // Parse ONCE: extract the first {...} JSON block if any, else treat as plain base64
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) {
        setCutoutB64(text.trim()); // server returned plain base64
      } else {
        const obj = JSON.parse(m[0]); // <-- only JSON.parse here
        if (!obj?.png_base64) throw new Error("missing png_base64");
        setCutoutB64(obj.png_base64 as string);
      }
    } catch (e: any) {
      Alert.alert("Preview error", e?.message ?? "unknown");
      setOrigUri(null);
      setCutoutB64(null);
    } finally {
      setLoading(false);
    }
  };

  const retake = () => {
    setOrigUri(null);
    setCutoutB64(null);
  };

  const save = async () => {
    if (!cutoutB64) return;
    try {
      setUploading(true);
      const r = await fetch(`${API}/api/upload_base64`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ png_base64: cutoutB64 }),
      });
      const t = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status} ${t.slice(0, 120)}`);
      retake();
      Alert.alert("Saved", "Image stored");
    } catch (e: any) {
      Alert.alert("Upload error", e?.message ?? "unknown");
    } finally {
      setUploading(false);
    }
  };

  const showingPreview = !!cutoutB64;

  return (
    <View style={styles.container}>
      <CameraView ref={camRef} style={styles.camera} facing="back" active={!showingPreview} />

      {!showingPreview && (
        <View style={styles.controls}>
          <Pressable style={[styles.shutter, loading && styles.disabled]} onPress={capture} disabled={loading}>
            {loading ? <ActivityIndicator /> : <Text style={styles.shutterText}>Capture</Text>}
          </Pressable>
        </View>
      )}

      {showingPreview && (
        <View style={styles.previewOverlay}>
          <Image source={{ uri: `data:image/png;base64,${cutoutB64}` }} style={styles.previewImage} />
          <View style={styles.previewBar}>
            <Pressable style={[styles.actionBtn, styles.retake]} onPress={retake} disabled={uploading}>
              <Text style={styles.actionText}>Retake</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.save]} onPress={save} disabled={uploading}>
              {uploading ? <ActivityIndicator /> : <Text style={[styles.actionText, styles.saveText]}>Save</Text>}
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  controls: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
  shutter: { paddingHorizontal: 28, paddingVertical: 16, borderRadius: 999, backgroundColor: "white" },
  shutterText: { fontSize: 16, fontWeight: "600" },
  disabled: { opacity: 0.6 },

  previewOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "black", justifyContent: "center", alignItems: "center" },
  previewImage: { width: "100%", height: "100%", resizeMode: "contain" },
  previewBar: { position: "absolute", bottom: 24, width: "100%", paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between" },
  actionBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.9)" },
  retake: { backgroundColor: "rgba(0,0,0,0.7)" },
  save: { backgroundColor: "white" },
  actionText: { fontWeight: "600", color: "white" },
  saveText: { color: "black" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  btn: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "white", borderRadius: 8 },
  btnText: { fontWeight: "600" },
});
