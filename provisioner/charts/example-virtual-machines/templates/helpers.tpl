{{- define "deduplicateDataSources" -}}
{{- $seen := dict -}}
{{- range . }}
  {{- if not ($seen.Has .dataSource) }}
    {{- $seen.Set .dataSource true }}
  {{- end }}
{{- end }}
{{- $seen.Keys | sort }}
{{- end }}