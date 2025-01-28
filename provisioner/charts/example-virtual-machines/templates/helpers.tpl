{{- define "deduplicateDataSources" -}}
{{- $seen := dict -}}
{{- $unique := list -}}
{{- range . }}
  {{- if not (hasKey $seen .dataSource) }}
    {{- $seen = $seen | merge (dict .dataSource true) }}
    {{- $unique = append $unique .dataSource }}
  {{- end }}
{{- end }}
{{- $unique -}}
{{- end }}