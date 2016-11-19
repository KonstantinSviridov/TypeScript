/// <reference path="../factory.ts" />
/// <reference path="../visitor.ts" />

/*@internal*/
namespace ts {
    export function transformScala(context: TransformationContext) {
        const { } = context;

        return transformSourceFile;

        function transformSourceFile(node: SourceFile) {
            emitScala(node);
            return node;
        }

        function emitScala(node: SourceFile) {
            const targetFileName = node.fileName + ".scala";
            const emitterDiagnostics = createDiagnosticCollection();
            const host = context.getEmitHost();
            //const resolver = context.getEmitResolver();
            const writer = createTextWriter(host.getNewLine());
            emitNode(writer, node);
            console.log("emitting scala!");
            
            // Write the output file
            writeFile(host, emitterDiagnostics, targetFileName, writer.getText(), false);
        }

        function emitNode(writer: EmitTextWriter, node: Node): void {
            writer.write("hi!");
            
            function emitTokenText(kind: SyntaxKind): void { }
            function emitParameter(node: ParameterDeclaration): void { }
            function emitLiteral(node: LiteralExpression): void { }
            function emitIdentifier(node: Identifier): void { }
            function emitQualifiedName(node: QualifiedName): void  { }
            function emitComputedPropertyName(node: ComputedPropertyName): void { }
            function emitTypeParameter(node: TypeParameterDeclaration): void { }
            function emitDecorator(node: Decorator): void { }
            function emitPropertySignature(node: PropertySignature): void { }
            function emitPropertyDeclaration(node: PropertyDeclaration): void { }
            function emitMethodSignature(node: MethodSignature): void { }
            function emitMethodDeclaration(node: MethodDeclaration): void { }
            function emitConstructor(node: ConstructorDeclaration): void { }
            function emitAccessorDeclaration(node: AccessorDeclaration): void { }
            function emitCallSignature(node: CallSignatureDeclaration): void { }
            function emitConstructSignature(node: ConstructSignatureDeclaration): void { }
            function emitIndexSignature(node: IndexSignatureDeclaration): void { }
            function emitTypePredicate(node: TypePredicateNode): void { }
            function emitTypeReference(node: TypeReferenceNode): void { }
            function emitFunctionType(node: FunctionTypeNode): void { }
            function emitConstructorType(node: ConstructorTypeNode): void { }
            function emitTypeQuery(node: TypeQueryNode): void { }
            function emitTypeLiteral(node: TypeLiteralNode): void { }
            function emitArrayType(node: ArrayTypeNode): void { }
            function emitTupleType(node: TupleTypeNode): void { }
            function emitUnionType(node: UnionTypeNode): void { }
            function emitIntersectionType(node: IntersectionTypeNode): void { }
            function emitParenthesizedType(node: ParenthesizedTypeNode): void { }
            function emitExpressionWithTypeArguments(node: ExpressionWithTypeArguments): void { }
            function emitThisType(): void { }
            function emitLiteralType(node: LiteralTypeNode): void { }
            function emitObjectBindingPattern(node: ObjectBindingPattern): void { }
            function emitArrayBindingPattern(node: ArrayBindingPattern): void { }
            function emitBindingElement(node: BindingElement): void { }
            function emitTemplateSpan(node: TemplateSpan): void { }
            function emitSemicolonClassElement(): void { }
            function emitBlock(node: Block): void { }
            function emitVariableStatement(node: VariableStatement): void { }
            function emitEmptyStatement(): void { }
            function emitExpressionStatement(node: ExpressionStatement): void { }
            function emitIfStatement(node: IfStatement): void { }
            function emitDoStatement(node: DoStatement): void { }
            function emitWhileStatement(node: WhileStatement): void { }
            function emitForStatement(node: ForStatement): void { }
            function emitForInStatement(node: ForInStatement): void { }
            function emitForOfStatement(node: ForOfStatement): void { }
            function emitContinueStatement(node: ContinueStatement): void { }
            function emitBreakStatement(node: BreakStatement): void { }
            function emitReturnStatement(node: ReturnStatement): void { }
            function emitWithStatement(node: WithStatement): void { }
            function emitSwitchStatement(node: SwitchStatement): void { }
            function emitLabeledStatement(node: LabeledStatement): void { }
            function emitThrowStatement(node: ThrowStatement): void { }
            function emitTryStatement(node: TryStatement): void { }
            function emitDebuggerStatement(node: DebuggerStatement): void { }
            function emitVariableDeclaration(node: VariableDeclaration): void { }
            function emitVariableDeclarationList(node: VariableDeclarationList): void { }
            function emitFunctionDeclaration(node: FunctionDeclaration): void { }
            function emitClassDeclaration(node: ClassDeclaration): void { }
            function emitInterfaceDeclaration(node: InterfaceDeclaration): void { }
            function emitTypeAliasDeclaration(node: TypeAliasDeclaration): void { }
            function emitEnumDeclaration(node: EnumDeclaration): void { }
            function emitModuleDeclaration(node: ModuleDeclaration): void { }
            function emitModuleBlock(node: ModuleBlock): void { }
            function emitCaseBlock(node: CaseBlock): void { }
            function emitImportEqualsDeclaration(node: ImportEqualsDeclaration): void { }
            function emitImportDeclaration(node: ImportDeclaration): void { }
            function emitImportClause(node: ImportClause): void { }
            function emitNamespaceImport(node: NamespaceImport): void { }
            function emitNamedImports(node: NamedImports): void { }
            function emitImportSpecifier(node: ImportSpecifier): void {}
            function emitExportAssignment(node: ExportAssignment): void { }
            function emitExportDeclaration(node: ExportDeclaration): void { }
            function emitNamedExports(node: NamedExports): void { }
            function emitExportSpecifier(node: ExportSpecifier): void { }
            function emitCaseClause(node: CaseClause): void { } 
            function emitDefaultClause(node: DefaultClause): void { }
            function emitHeritageClause(node: HeritageClause): void { }
            function emitCatchClause(node: CatchClause): void { }
            function emitPropertyAssignment(node: PropertyAssignment): void { }
            function emitShorthandPropertyAssignment(node: ShorthandPropertyAssignment): void { }
            function emitEnumMember(node: EnumMember): void { }

            switch (node.kind) {
                // Pseudo-literals
                case SyntaxKind.TemplateHead:
                case SyntaxKind.TemplateMiddle:
                case SyntaxKind.TemplateTail:
                    return emitLiteral(<LiteralExpression>node);

                // Identifiers
                case SyntaxKind.Identifier:
                    return emitIdentifier(<Identifier>node);

                // Reserved words
                case SyntaxKind.ConstKeyword:
                case SyntaxKind.DefaultKeyword:
                case SyntaxKind.ExportKeyword:
                case SyntaxKind.VoidKeyword:

                // Strict mode reserved words
                case SyntaxKind.PrivateKeyword:
                case SyntaxKind.ProtectedKeyword:
                case SyntaxKind.PublicKeyword:
                case SyntaxKind.StaticKeyword:

                // Contextual keywords
                case SyntaxKind.AbstractKeyword:
                case SyntaxKind.AsKeyword:
                case SyntaxKind.AnyKeyword:
                case SyntaxKind.AsyncKeyword:
                case SyntaxKind.AwaitKeyword:
                case SyntaxKind.BooleanKeyword:
                case SyntaxKind.ConstructorKeyword:
                case SyntaxKind.DeclareKeyword:
                case SyntaxKind.GetKeyword:
                case SyntaxKind.IsKeyword:
                case SyntaxKind.ModuleKeyword:
                case SyntaxKind.NamespaceKeyword:
                case SyntaxKind.NeverKeyword:
                case SyntaxKind.ReadonlyKeyword:
                case SyntaxKind.RequireKeyword:
                case SyntaxKind.NumberKeyword:
                case SyntaxKind.SetKeyword:
                case SyntaxKind.StringKeyword:
                case SyntaxKind.SymbolKeyword:
                case SyntaxKind.TypeKeyword:
                case SyntaxKind.UndefinedKeyword:
                case SyntaxKind.FromKeyword:
                case SyntaxKind.GlobalKeyword:
                case SyntaxKind.OfKeyword:
                    emitTokenText(kind);
                    return;

                // Parse tree nodes

                // Names
                case SyntaxKind.QualifiedName:
                    return emitQualifiedName(<QualifiedName>node);
                case SyntaxKind.ComputedPropertyName:
                    return emitComputedPropertyName(<ComputedPropertyName>node);

                // Signature elements
                case SyntaxKind.TypeParameter:
                    return emitTypeParameter(<TypeParameterDeclaration>node);
                case SyntaxKind.Parameter:
                    return emitParameter(<ParameterDeclaration>node);
                case SyntaxKind.Decorator:
                    return emitDecorator(<Decorator>node);

                // Type members
                case SyntaxKind.PropertySignature:
                    return emitPropertySignature(<PropertySignature>node);
                case SyntaxKind.PropertyDeclaration:
                    return emitPropertyDeclaration(<PropertyDeclaration>node);
                case SyntaxKind.MethodSignature:
                    return emitMethodSignature(<MethodSignature>node);
                case SyntaxKind.MethodDeclaration:
                    return emitMethodDeclaration(<MethodDeclaration>node);
                case SyntaxKind.Constructor:
                    return emitConstructor(<ConstructorDeclaration>node);
                case SyntaxKind.GetAccessor:
                case SyntaxKind.SetAccessor:
                    return emitAccessorDeclaration(<AccessorDeclaration>node);
                case SyntaxKind.CallSignature:
                    return emitCallSignature(<CallSignatureDeclaration>node);
                case SyntaxKind.ConstructSignature:
                    return emitConstructSignature(<ConstructSignatureDeclaration>node);
                case SyntaxKind.IndexSignature:
                    return emitIndexSignature(<IndexSignatureDeclaration>node);

                // Types
                case SyntaxKind.TypePredicate:
                    return emitTypePredicate(<TypePredicateNode>node);
                case SyntaxKind.TypeReference:
                    return emitTypeReference(<TypeReferenceNode>node);
                case SyntaxKind.FunctionType:
                    return emitFunctionType(<FunctionTypeNode>node);
                case SyntaxKind.ConstructorType:
                    return emitConstructorType(<ConstructorTypeNode>node);
                case SyntaxKind.TypeQuery:
                    return emitTypeQuery(<TypeQueryNode>node);
                case SyntaxKind.TypeLiteral:
                    return emitTypeLiteral(<TypeLiteralNode>node);
                case SyntaxKind.ArrayType:
                    return emitArrayType(<ArrayTypeNode>node);
                case SyntaxKind.TupleType:
                    return emitTupleType(<TupleTypeNode>node);
                case SyntaxKind.UnionType:
                    return emitUnionType(<UnionTypeNode>node);
                case SyntaxKind.IntersectionType:
                    return emitIntersectionType(<IntersectionTypeNode>node);
                case SyntaxKind.ParenthesizedType:
                    return emitParenthesizedType(<ParenthesizedTypeNode>node);
                case SyntaxKind.ExpressionWithTypeArguments:
                    return emitExpressionWithTypeArguments(<ExpressionWithTypeArguments>node);
                case SyntaxKind.ThisType:
                    return emitThisType();
                case SyntaxKind.LiteralType:
                    return emitLiteralType(<LiteralTypeNode>node);

                // Binding patterns
                case SyntaxKind.ObjectBindingPattern:
                    return emitObjectBindingPattern(<ObjectBindingPattern>node);
                case SyntaxKind.ArrayBindingPattern:
                    return emitArrayBindingPattern(<ArrayBindingPattern>node);
                case SyntaxKind.BindingElement:
                    return emitBindingElement(<BindingElement>node);

                // Misc
                case SyntaxKind.TemplateSpan:
                    return emitTemplateSpan(<TemplateSpan>node);
                case SyntaxKind.SemicolonClassElement:
                    return emitSemicolonClassElement();

                // Statements
                case SyntaxKind.Block:
                    return emitBlock(<Block>node);
                case SyntaxKind.VariableStatement:
                    return emitVariableStatement(<VariableStatement>node);
                case SyntaxKind.EmptyStatement:
                    return emitEmptyStatement();
                case SyntaxKind.ExpressionStatement:
                    return emitExpressionStatement(<ExpressionStatement>node);
                case SyntaxKind.IfStatement:
                    return emitIfStatement(<IfStatement>node);
                case SyntaxKind.DoStatement:
                    return emitDoStatement(<DoStatement>node);
                case SyntaxKind.WhileStatement:
                    return emitWhileStatement(<WhileStatement>node);
                case SyntaxKind.ForStatement:
                    return emitForStatement(<ForStatement>node);
                case SyntaxKind.ForInStatement:
                    return emitForInStatement(<ForInStatement>node);
                case SyntaxKind.ForOfStatement:
                    return emitForOfStatement(<ForOfStatement>node);
                case SyntaxKind.ContinueStatement:
                    return emitContinueStatement(<ContinueStatement>node);
                case SyntaxKind.BreakStatement:
                    return emitBreakStatement(<BreakStatement>node);
                case SyntaxKind.ReturnStatement:
                    return emitReturnStatement(<ReturnStatement>node);
                case SyntaxKind.WithStatement:
                    return emitWithStatement(<WithStatement>node);
                case SyntaxKind.SwitchStatement:
                    return emitSwitchStatement(<SwitchStatement>node);
                case SyntaxKind.LabeledStatement:
                    return emitLabeledStatement(<LabeledStatement>node);
                case SyntaxKind.ThrowStatement:
                    return emitThrowStatement(<ThrowStatement>node);
                case SyntaxKind.TryStatement:
                    return emitTryStatement(<TryStatement>node);
                case SyntaxKind.DebuggerStatement:
                    return emitDebuggerStatement(<DebuggerStatement>node);

                // Declarations
                case SyntaxKind.VariableDeclaration:
                    return emitVariableDeclaration(<VariableDeclaration>node);
                case SyntaxKind.VariableDeclarationList:
                    return emitVariableDeclarationList(<VariableDeclarationList>node);
                case SyntaxKind.FunctionDeclaration:
                    return emitFunctionDeclaration(<FunctionDeclaration>node);
                case SyntaxKind.ClassDeclaration:
                    return emitClassDeclaration(<ClassDeclaration>node);
                case SyntaxKind.InterfaceDeclaration:
                    return emitInterfaceDeclaration(<InterfaceDeclaration>node);
                case SyntaxKind.TypeAliasDeclaration:
                    return emitTypeAliasDeclaration(<TypeAliasDeclaration>node);
                case SyntaxKind.EnumDeclaration:
                    return emitEnumDeclaration(<EnumDeclaration>node);
                case SyntaxKind.ModuleDeclaration:
                    return emitModuleDeclaration(<ModuleDeclaration>node);
                case SyntaxKind.ModuleBlock:
                    return emitModuleBlock(<ModuleBlock>node);
                case SyntaxKind.CaseBlock:
                    return emitCaseBlock(<CaseBlock>node);
                case SyntaxKind.ImportEqualsDeclaration:
                    return emitImportEqualsDeclaration(<ImportEqualsDeclaration>node);
                case SyntaxKind.ImportDeclaration:
                    return emitImportDeclaration(<ImportDeclaration>node);
                case SyntaxKind.ImportClause:
                    return emitImportClause(<ImportClause>node);
                case SyntaxKind.NamespaceImport:
                    return emitNamespaceImport(<NamespaceImport>node);
                case SyntaxKind.NamedImports:
                    return emitNamedImports(<NamedImports>node);
                case SyntaxKind.ImportSpecifier:
                    return emitImportSpecifier(<ImportSpecifier>node);
                case SyntaxKind.ExportAssignment:
                    return emitExportAssignment(<ExportAssignment>node);
                case SyntaxKind.ExportDeclaration:
                    return emitExportDeclaration(<ExportDeclaration>node);
                case SyntaxKind.NamedExports:
                    return emitNamedExports(<NamedExports>node);
                case SyntaxKind.ExportSpecifier:
                    return emitExportSpecifier(<ExportSpecifier>node);
                case SyntaxKind.MissingDeclaration:
                    return;

                // Module references
                case SyntaxKind.ExternalModuleReference:
                    return emitExternalModuleReference(<ExternalModuleReference>node);

                // JSX (non-expression)
                case SyntaxKind.JsxText:
                    return;
                case SyntaxKind.JsxOpeningElement:
                    return;
                case SyntaxKind.JsxClosingElement:
                    return;
                case SyntaxKind.JsxAttribute:
                    return;
                case SyntaxKind.JsxSpreadAttribute:
                    return;
                case SyntaxKind.JsxExpression:
                    return;

                // Clauses
                case SyntaxKind.CaseClause:
                    return emitCaseClause(<CaseClause>node);
                case SyntaxKind.DefaultClause:
                    return emitDefaultClause(<DefaultClause>node);
                case SyntaxKind.HeritageClause:
                    return emitHeritageClause(<HeritageClause>node);
                case SyntaxKind.CatchClause:
                    return emitCatchClause(<CatchClause>node);

                // Property assignments
                case SyntaxKind.PropertyAssignment:
                    return emitPropertyAssignment(<PropertyAssignment>node);
                case SyntaxKind.ShorthandPropertyAssignment:
                    return emitShorthandPropertyAssignment(<ShorthandPropertyAssignment>node);

                // Enum
                case SyntaxKind.EnumMember:
                    return emitEnumMember(<EnumMember>node);

                // JSDoc nodes (ignored)
                // Transformation nodes (ignored)
            }
        }
    }
}
