#define SECTOR_COUNT 8

uniform int radius;
uniform int kernelSize;
uniform sampler2D textureSampler;
uniform vec2 resolution;
uniform sampler2D originalTexture;

varying vec2 vUV;

vec3 sampleColor(vec2 offset) {
    vec2 coord = (gl_FragCoord.xy + offset) / resolution;
    return texture2D(textureSampler, coord).rgb;
}

void getSectorVarianceAndAverageColor(float angle, float radius, out vec3 avgColor, out float variance) {
    vec3 colorSum = vec3(0.0);
    vec3 squaredColorSum = vec3(0.0);
    float sampleCount = 0.0;

    for (float r = 1.0; r <= radius; r += 1.0) {
        for (float a = -0.392699; a <= 0.392699; a += 0.196349) {
            vec2 sampleOffset = r * vec2(cos(angle + a), sin(angle + a));
            vec3 color = sampleColor(sampleOffset);
            colorSum += color;
            squaredColorSum += color * color;
            sampleCount += 1.0;
        }
    }

    // Calculate average color and variance
    avgColor = colorSum / sampleCount;
    vec3 varianceRes = (squaredColorSum / sampleCount) - (avgColor * avgColor);
    variance = dot(varianceRes, vec3(0.299, 0.587, 0.114)); // Convert to luminance
}

void main() {
    vec3 sectorAvgColors[SECTOR_COUNT];
    float sectorVariances[SECTOR_COUNT];

    for (int i = 0; i < SECTOR_COUNT; i++) {
      float angle = float(i) * 6.28318 / float(SECTOR_COUNT); // 2π / SECTOR_COUNT
      getSectorVarianceAndAverageColor(angle, float(radius), sectorAvgColors[i], sectorVariances[i]);
    }

    float minVariance = sectorVariances[0];
    vec3 finalColor = sectorAvgColors[0];

    for (int i = 1; i < SECTOR_COUNT; i++) {
        if (sectorVariances[i] < minVariance) {
            minVariance = sectorVariances[i];
            finalColor = sectorAvgColors[i];
        }
    }

    gl_FragColor = vec4(finalColor, 1.0);
}