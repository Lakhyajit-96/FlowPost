"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Github, 
  Slack, 
  Zap, 
  Globe, 
  Database, 
  Apple, 
  Chrome, 
  Facebook, 
  Instagram, 
  Linkedin,
  Youtube,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Check
} from "lucide-react"
import { XIcon } from "@/components/icons/x-icon"
import { PinterestIcon } from "@/components/icons/pinterest-icon"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

interface SocialConnection {
  id: string
  platform: string
  platform_username: string
  platform_display_name: string
  platform_profile_image: string
  is_active: boolean
  follower_count: number
  following_count: number
  post_count: number
  connected_at: string
  last_error?: string
}

const SOCIAL_PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    description: 'Share updates and manage your Facebook page',
    color: '#1877F2'
  },
  {
    id: 'twitter',
    name: 'X',
    icon: XIcon,
    description: 'Post and engage with your audience on X',
    color: '#000000'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    description: 'Share photos and stories with your followers',
    color: '#E4405F'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    description: 'Share professional updates and articles',
    color: '#0A66C2'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    description: 'Upload and manage your video content',
    color: '#FF0000'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: PinterestIcon,
    description: 'Pin and share visual content',
    color: '#E60023'
  },
]

export default function ConnectionSettings() {
  const { user } = useUser()
  const [connections, setConnections] = useState<SocialConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null)
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null)

  // State for other integrations (now with database)
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({})
  const [integrationsLoading, setIntegrationsLoading] = useState(true)
  const [togglingIntegration, setTogglingIntegration] = useState<string | null>(null)

  // State for API keys (now with database)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [apiKeysLoading, setApiKeysLoading] = useState(true)
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null)
  const [regeneratingKeyId, setRegeneratingKeyId] = useState<string | null>(null)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [newKeyData, setNewKeyData] = useState<{ fullKey: string; keyName: string } | null>(null)
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'production' | 'development'>('development')
  const [creatingKey, setCreatingKey] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  // Fetch connections on mount
  useEffect(() => {
    if (user) {
      fetchConnections()
      fetchIntegrations()
      fetchApiKeys()
    }
  }, [user])

  // Handle OAuth callback success/error
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const error = params.get('error')

    if (success) {
      toast.success(`${success.charAt(0).toUpperCase() + success.slice(1)} connected successfully!`)
      // Refresh connections
      fetchConnections()
      // Clean URL
      window.history.replaceState({}, '', '/settings/connections')
    }

    if (error) {
      const errorMessages: Record<string, string> = {
        'missing_params': 'OAuth parameters missing',
        'invalid_state': 'Invalid OAuth state - possible CSRF attack',
        'token_exchange_failed': 'Failed to exchange authorization code',
        'profile_fetch_failed': 'Failed to fetch profile information',
        'database_error': 'Failed to save connection',
        'unexpected_error': 'An unexpected error occurred',
      }
      toast.error(errorMessages[error] || 'Failed to connect account')
      // Clean URL
      window.history.replaceState({}, '', '/settings/connections')
    }
  }, [user])

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/social-connections')
      const data = await response.json()

      if (response.ok) {
        setConnections(data.connections || [])
      } else {
        toast.error('Failed to load connections')
      }
    } catch (error) {
      console.error('Error fetching connections:', error)
      toast.error('Failed to load connections')
    } finally {
      setLoading(false)
    }
  }

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations')
      const data = await response.json()

      if (response.ok) {
        const integrationsMap: Record<string, boolean> = {}
        data.integrations.forEach((integration: any) => {
          integrationsMap[integration.integration_type] = integration.is_connected
        })
        setIntegrations(integrationsMap)
      }
    } catch (error) {
      console.error('Error fetching integrations:', error)
    } finally {
      setIntegrationsLoading(false)
    }
  }

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      const data = await response.json()

      if (response.ok) {
        setApiKeys(data.apiKeys || [])
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
    } finally {
      setApiKeysLoading(false)
    }
  }

  const handleConnect = async (platform: string) => {
    setConnectingPlatform(platform)
    try {
      // Redirect to OAuth initiation endpoint
      window.location.href = `/api/oauth/initiate/${platform}`
    } catch (error) {
      console.error('Error connecting account:', error)
      toast.error('Failed to connect account')
      setConnectingPlatform(null)
    }
  }

  const handleDisconnect = async (connectionId: string, platform: string) => {
    setDisconnectingId(connectionId)
    try {
      const response = await fetch(`/api/social-connections/${connectionId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setConnections(connections.filter(conn => conn.id !== connectionId))
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to disconnect account')
      }
    } catch (error) {
      console.error('Error disconnecting account:', error)
      toast.error('Failed to disconnect account')
    } finally {
      setDisconnectingId(null)
    }
  }

  const handleToggleIntegration = async (integrationType: string, currentState: boolean) => {
    setTogglingIntegration(integrationType)
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integration_type: integrationType,
          is_connected: !currentState,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIntegrations(prev => ({ ...prev, [integrationType]: !currentState }))
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to update integration')
      }
    } catch (error) {
      console.error('Error toggling integration:', error)
      toast.error('Failed to update integration')
    } finally {
      setTogglingIntegration(null)
    }
  }

  const handleCreateApiKey = async (keyName: string, environment: string) => {
    setCreatingKey(true)
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_name: keyName, environment }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewKeyData({ fullKey: data.fullKey, keyName: data.apiKey.key_name })
        setShowNewKeyModal(true)
        setShowCreateKeyDialog(false)
        setNewKeyName('')
        setNewKeyEnvironment('development')
        fetchApiKeys()
        toast.success('API key created successfully')
      } else {
        toast.error(data.error || 'Failed to create API key')
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      toast.error('Failed to create API key')
    } finally {
      setCreatingKey(false)
    }
  }

  const handleRegenerateKey = async (keyId: string) => {
    setRegeneratingKeyId(keyId)
    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (response.ok) {
        setNewKeyData({ fullKey: data.fullKey, keyName: data.apiKey.key_name })
        setShowNewKeyModal(true)
        fetchApiKeys()
        toast.success('API key regenerated successfully')
      } else {
        toast.error(data.error || 'Failed to regenerate API key')
      }
    } catch (error) {
      console.error('Error regenerating API key:', error)
      toast.error('Failed to regenerate API key')
    } finally {
      setRegeneratingKeyId(null)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    setDeletingKeyId(keyId)
    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId))
        toast.success('API key deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete API key')
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast.error('Failed to delete API key')
    } finally {
      setDeletingKeyId(null)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(true)
    toast.success('API key copied to clipboard')
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const getConnectionForPlatform = (platformId: string) => {
    return connections.find(conn => conn.platform === platformId)
  }

  const isConnecting = (platformId: string) => {
    return connectingPlatform === platformId
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Connections</h1>
          <p className="text-muted-foreground">
            Connect your social media accounts and manage integrations.
          </p>
        </div>

        {/* Social Media Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Accounts</CardTitle>
            <CardDescription>
              Connect your social media accounts to schedule and publish posts across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {SOCIAL_PLATFORMS.map((platform, index) => {
                  const connection = getConnectionForPlatform(platform.id)
                  const isConnected = !!connection
                  const isLoading = isConnecting(platform.id) || disconnectingId === connection?.id

                  return (
                    <div key={platform.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <platform.icon 
                              className="h-10 w-10" 
                              style={{ color: platform.color }}
                            />
                            {isConnected && (
                              <CheckCircle2 
                                className="absolute -bottom-1 -right-1 h-4 w-4 text-green-500 bg-background rounded-full" 
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{platform.name}</span>
                              {isConnected ? (
                                <Badge variant="secondary" className="text-xs">
                                  Connected
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Not Connected
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {isConnected 
                                ? `@${connection.platform_username} • ${connection.follower_count.toLocaleString()} followers`
                                : platform.description
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isConnected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => handleDisconnect(connection.id, platform.name)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Disconnecting...
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Disconnect
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => handleConnect(platform.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                'Connect'
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Other Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>Other Integrations</CardTitle>
              <CardDescription>
                Connect with productivity and development tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              {integrationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Apple className="h-8 w-8" />
                      <div>
                        <div className="font-medium">Apple</div>
                        <div className="text-sm text-muted-foreground">Calendar and contacts</div>
                      </div>
                    </div>
                    <Switch
                      className="cursor-pointer"
                      checked={integrations['apple'] || false}
                      onCheckedChange={() => handleToggleIntegration('apple', integrations['apple'] || false)}
                      disabled={togglingIntegration === 'apple'}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Chrome className="h-8 w-8" />
                      <div>
                        <div className="font-medium">Google</div>
                        <div className="text-sm text-muted-foreground">Calendar and contacts</div>
                      </div>
                    </div>
                    <Switch
                      className="cursor-pointer"
                      checked={integrations['google'] || false}
                      onCheckedChange={() => handleToggleIntegration('google', integrations['google'] || false)}
                      disabled={togglingIntegration === 'google'}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Github className="h-8 w-8" />
                      <div>
                        <div className="font-medium">Github</div>
                        <div className="text-sm text-muted-foreground">Manage your Git repositories</div>
                      </div>
                    </div>
                    <Switch
                      className="cursor-pointer"
                      checked={integrations['github'] || false}
                      onCheckedChange={() => handleToggleIntegration('github', integrations['github'] || false)}
                      disabled={togglingIntegration === 'github'}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Slack className="h-8 w-8" />
                      <div>
                        <div className="font-medium">Slack</div>
                        <div className="text-sm text-muted-foreground">Communication</div>
                      </div>
                    </div>
                    <Switch
                      className="cursor-pointer"
                      checked={integrations['slack'] || false}
                      onCheckedChange={() => handleToggleIntegration('slack', integrations['slack'] || false)}
                      disabled={togglingIntegration === 'slack'}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Configure API connections and webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {integrationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-8 w-8" />
                      <div>
                        <div className="font-medium">Zapier</div>
                        <div className="text-sm text-muted-foreground">Automate workflows with Zapier</div>
                      </div>
                    </div>
                    <Switch
                      className="cursor-pointer"
                      checked={integrations['zapier'] || false}
                      onCheckedChange={() => handleToggleIntegration('zapier', integrations['zapier'] || false)}
                      disabled={togglingIntegration === 'zapier'}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-8 w-8" />
                      <div>
                        <div className="font-medium">Webhooks</div>
                        <div className="text-sm text-muted-foreground">Configure custom webhook endpoints</div>
                      </div>
                    </div>
                    <Switch
                      className="cursor-pointer"
                      checked={integrations['webhooks'] || false}
                      onCheckedChange={() => handleToggleIntegration('webhooks', integrations['webhooks'] || false)}
                      disabled={togglingIntegration === 'webhooks'}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Database className="h-8 w-8" />
                      <div>
                        <div className="font-medium">Database Sync</div>
                        <div className="text-sm text-muted-foreground">Sync data with external databases</div>
                      </div>
                    </div>
                    <Switch
                      className="cursor-pointer"
                      checked={integrations['database'] || false}
                      onCheckedChange={() => handleToggleIntegration('database', integrations['database'] || false)}
                      disabled={togglingIntegration === 'database'}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys and access tokens for programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeysLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No API keys yet. Create one to get started.
                  </div>
                ) : (
                  apiKeys.map((key, index) => (
                    <div key={key.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="font-medium">{key.key_name}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {key.key_prefix}••••••••••••••••••••••••{key.key_last_four}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {key.environment === 'production' ? 'Production' : 'Development'} • 
                            Created {new Date(key.created_at).toLocaleDateString()}
                            {key.last_used_at && ` • Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="cursor-pointer"
                            onClick={() => handleRegenerateKey(key.id)}
                            disabled={regeneratingKeyId === key.id}
                          >
                            {regeneratingKeyId === key.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Regenerating...
                              </>
                            ) : (
                              'Regenerate'
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="cursor-pointer text-destructive hover:text-destructive"
                            onClick={() => handleDeleteKey(key.id)}
                            disabled={deletingKeyId === key.id}
                          >
                            {deletingKeyId === key.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Delete'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Separator className="my-4" />
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setShowCreateKeyDialog(true)}
                  >
                    Add New API Key
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create API Key Dialog */}
        <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for programmatic access to FlowPost
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="environment"
                      value="development"
                      checked={newKeyEnvironment === 'development'}
                      onChange={(e) => setNewKeyEnvironment(e.target.value as 'development')}
                      className="cursor-pointer"
                    />
                    <span>Development</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="environment"
                      value="production"
                      checked={newKeyEnvironment === 'production'}
                      onChange={(e) => setNewKeyEnvironment(e.target.value as 'production')}
                      className="cursor-pointer"
                    />
                    <span>Production</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateKeyDialog(false)
                  setNewKeyName('')
                  setNewKeyEnvironment('development')
                }}
                disabled={creatingKey}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleCreateApiKey(newKeyName, newKeyEnvironment)}
                disabled={!newKeyName.trim() || creatingKey}
                className="cursor-pointer"
              >
                {creatingKey ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create API Key'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Show New Key Dialog */}
        <Dialog open={showNewKeyModal} onOpenChange={setShowNewKeyModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Save Your API Key</DialogTitle>
              <DialogDescription>
                This is the only time you'll see this key. Copy it now and store it securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Key Name</Label>
                <div className="font-medium">{newKeyData?.keyName}</div>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <div className="flex-1 font-mono text-sm break-all bg-muted p-3 rounded border">
                    {newKeyData?.fullKey}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer shrink-0"
                    onClick={() => newKeyData && handleCopyKey(newKeyData.fullKey)}
                  >
                    {copiedKey ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Warning: Once you close this dialog, you won't be able to see this key again.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="cursor-pointer"
                onClick={() => {
                  setShowNewKeyModal(false)
                  setNewKeyData(null)
                  setCopiedKey(false)
                }}
              >
                I've Saved My Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
