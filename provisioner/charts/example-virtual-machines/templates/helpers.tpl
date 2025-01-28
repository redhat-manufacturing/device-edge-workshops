{{- define "deduplicateDataSources" -}}
{{- $seen := dict -}}
{{- $unique := list -}}
{{- range . }}
  {{- if not ($seen.Has .dataSource) }}
    {{- $seen.Set .dataSource true }}
    {{- $unique = append $unique .dataSource }}
  {{- end }}
{{- end }}
{{- $unique -}}
{{- end }}