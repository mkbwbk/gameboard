'use client';

import { useState, useRef } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportData, importData, downloadBackup } from '@/lib/db/backup';
import { Download, Upload, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const json = await exportData();
      downloadBackup(json);
    } finally {
      setExporting(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const result = await importData(text);
    setImportStatus({ type: result.success ? 'success' : 'error', message: result.message });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <PageContainer>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            All your data is stored locally on this device. Export a backup to keep your scores safe.
          </p>

          <Button onClick={handleExport} disabled={exporting} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export Backup'}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          {importStatus && (
            <div className={`text-sm p-3 rounded-lg ${
              importStatus.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
            }`}>
              {importStatus.message}
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Importing a backup will replace all current data. Export first if you want to keep your existing scores.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About Score Door</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Version 1.0 — Track game scores with friends.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Data is stored locally in your browser using IndexedDB.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
